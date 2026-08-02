#!/usr/bin/env ruby
# frozen_string_literal: true

require 'fileutils'
require 'net/http'
require 'set'
require 'time'
require 'uri'

ROOT_URL = URI('https://core-connections.ca/')
OUTPUT_DIR = File.expand_path('scrape', __dir__)
MAX_PAGES = 200

def local_path(uri)
  path = uri.path
  path = '/' if path.empty?
  path = "#{path}index.html" if path.end_with?('/')
  path = "#{path}.html" if File.extname(path).empty?
  query_suffix = uri.query ? "-#{uri.query.hash.abs}" : ''
  File.join(OUTPUT_DIR, path.sub(%r{^/}, '').sub(/(\.[^\/]+)$/, "#{query_suffix}\\1"))
end

def fetch(uri)
  request = Net::HTTP::Get.new(uri)
  request['User-Agent'] = 'CoreConnectionsArchive/1.0 (local content migration archive)'
  Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https', open_timeout: 15, read_timeout: 30) do |http|
    response = http.request(request)
    return response if response.is_a?(Net::HTTPSuccess)

    warn "Skipped #{uri}: HTTP #{response.code}"
    nil
  end
rescue StandardError => error
  warn "Skipped #{uri}: #{error.message}"
  nil
end

def same_site_uri(value, base)
  return if value.nil? || value.empty? || value.start_with?('#', 'mailto:', 'tel:', 'javascript:', 'data:')

  uri = URI.join(base.to_s, value).normalize
  return unless uri.host == ROOT_URL.host

  uri.fragment = nil
  uri
rescue URI::InvalidURIError
  nil
end

FileUtils.rm_rf(OUTPUT_DIR)
FileUtils.mkdir_p(OUTPUT_DIR)

queue = [ROOT_URL]
visited = Set.new
html_count = 0
asset_count = 0

until queue.empty? || html_count >= MAX_PAGES
  uri = queue.shift
  key = uri.to_s
  next if visited.include?(key)

  visited << key
  response = fetch(uri)
  next unless response

  content_type = response['content-type'].to_s
  body = response.body
  destination = local_path(uri)
  FileUtils.mkdir_p(File.dirname(destination))
  File.binwrite(destination, body)

  unless content_type.include?('text/html')
    asset_count += 1
    next
  end

  html_count += 1
  references = body.scan(/(?:href|src|srcset)\s*=\s*["']([^"']+)["']/i).flatten
  references.each do |reference|
    reference.split(',').each do |candidate|
      value = candidate.strip.split(/\s+/).first
      child = same_site_uri(value, uri)
      next unless child

      extension = File.extname(child.path).downcase
      is_asset = %w[.css .js .jpg .jpeg .png .gif .webp .svg .woff .woff2 .ttf .pdf .ico].include?(extension)
      queue << child if is_asset || content_type.include?('text/html')
    end
  end

  puts "Saved #{uri}"
end

manifest = {
  source: ROOT_URL.to_s,
  fetched_at: Time.now.utc.iso8601,
  html_pages: html_count,
  assets: asset_count,
  urls: visited.to_a.sort
}
File.write(File.join(OUTPUT_DIR, 'manifest.txt'), manifest.map { |key, value| "#{key}: #{value.is_a?(Array) ? value.join("\n  ") : value}" }.join("\n"))

puts "Archived #{html_count} HTML pages and #{asset_count} assets in #{OUTPUT_DIR}"
