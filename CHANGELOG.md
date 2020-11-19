# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2020-11-19
### Changed
- Improve CI for better usage of limited GitHub space.

### Fixed
- Adjust redirect logic to detect valid relative redirects.
- Fix ExpressProvider by binding the getCertificate function to the class.

## [1.0.0] - 2020-11-16
### Added
- Add functionality to get the certificate of a domain.
- Add `getCertificate` endpoint to API which returns the fetched certificate in PEM-format.
