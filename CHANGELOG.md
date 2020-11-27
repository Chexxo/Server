# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [2.0.0] - 2020-11-27
### Added
- Posibility to define the port of the server in the express variant.
- The `/certificate` endpoint which will replace the now removed `/getCertificate` endpoint.
- Better documentation regarding the local server installation.
- Better documentation regarding the AWS server installation.

### Removed
- The `/getCertificate` endpoint. It's functionallity will be completely replaced by the `/certificate` endpoint.

### Fixed
- Bug which was preventing the fetching of certificates with redirect codes other than `301` or `302`.

## [1.1.0] - 2020-11-22
### Added
- Add logging functionality.
- Add uuid to APIResponseError in order to allow log correlation.

### Changed
- Adjusted openapi.yaml to represent all available fields.

## [1.0.1] - 2020-11-18
### Changed
- Improve CI for better usage of limited GitHub space.

### Fixed
- Adjust redirect logic to detect valid relative redirects.
- Fix ExpressProvider by binding the getCertificate function to the class.

## [1.0.0] - 2020-11-16
### Added
- Add functionality to get the certificate of a domain.
- Add `getCertificate` endpoint to API which returns the fetched certificate in PEM-format.
