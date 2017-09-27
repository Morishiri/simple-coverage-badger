# Simple coverage badger

*Using shields.io*

## Usage
```
$ index.js [options]

Options:
  --help                  Show help                                                                            [boolean]
  --version               Show version number                                                                  [boolean]
  --input, -i             Input file path                        [string] [default: "./coverage/cobertura-coverage.xml"]
  --outputFileName, -o    Output file name (without extension)                               [string] [default: "badge"]
  --outputDirectory, -d   Output file name (without extension)                                   [string] [default: "."]
  --format, -f            Output file format (extension)               [string] [choices: "svg", "png"] [default: "svg"]
  --badgeHosting, -h      Badge hosting server                              [string] [default: "https://img.shields.io"]
  --coverageScope, -c     Scope for badge                     [string] [choices: "branches", "lines"] [default: "lines"]
  --excelentTreshold, -e  Treshold for excelent coverage rating (brightgreen)                     [number] [default: 95]
  --goodTreshold, -g      Treshold for good coverage rating (green)                               [number] [default: 80]
  --mediumTreshold, -m    Treshold for medium coverage rating (yellow)                            [number] [default: 60]
  --style, -s             Badge style   [string] [choices: "plastic", "flat-square", "flat", "social"] [default: "flat"]
  --text, -t              Text on the left side of badge                                  [string] [default: "coverage"]
```
## Please read

This repository contains module which is not yet finished, nor properly tested etc. Use on your own responsibility.
