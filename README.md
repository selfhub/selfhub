SelfHub
=======
[![Build Status][build-img]][build-url]
[![Dependency Status][dependencies-img]][dependencies-url]
[![devDependency Status][devDependencies-img]][devDependencies-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Code Climate][climate-img]][climate-url]

SelfHub is a central platform for sharing and analyzing quantified self data.

## Team

  - __Product Owner__: [Brian Zindler](https://github.com/zindlerb)
  - __Technical Lead__: [Dug Eichelberger](https://github.com/dduugg)
  - __Scrum Master__: [Chris Perez](https://github.com/cmperez)
  - __Development Team Members__: [Owen Diehl](https://github.com/owen-d), [Rachel Sison](https://github.com/rachelsison)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Roadmap](#roadmap)
1. [Contributing](#contributing)
1. [License](#license)

## Usage

1. Create an account
1. Find or create schemas to contribute to
1. Start tracking and upload your data

## Development
From the root directory of the project:

1. Install dependencies:

    ```
    $ npm install
    ```

1. Build the client:

    ```
    $ grunt build
    ```

1. Generate documentation (optional):

    ```
    $ grunt doc
    ```

1. Launch the server:

    ```
    $ npm start
    ```

## Roadmap

View the project roadmap [here][roadmap-url].

## Contributing

See [CONTRIBUTING.md][contributing-url] for contribution guidelines.

## License

MIT License 2014

[build-img]: https://travis-ci.org/selfhub/selfhub.svg
[build-url]: https://travis-ci.org/selfhub/selfhub
[climate-img]: https://img.shields.io/codeclimate/github/selfhub/selfhub.svg?style=flat
[climate-url]: https://codeclimate.com/github/selfhub/selfhub
[contributing-url]: https://github.com/selfhub/selfhub/blob/develop/CONTRIBUTING.md
[coveralls-image]: https://img.shields.io/coveralls/selfhub/selfhub/develop.svg?style=flat
[coveralls-url]: https://coveralls.io/r/selfhub/selfhub?branch=develop
[dependencies-img]: https://david-dm.org/selfhub/selfhub.svg
[dependencies-url]: https://david-dm.org/selfhub/selfhub
[devDependencies-img]: https://david-dm.org/selfhub/selfhub/dev-status.svg
[devDependencies-url]: https://david-dm.org/selfhub/selfhub#info=devDependencies
[roadmap-url]: https://github.com/selfhub/selfhub/wiki/Roadmap
