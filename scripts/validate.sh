#!/bin/bash
################
### web-test ###
################

html="index.html"
css="stylesheets/photothief.css"
js="js/photothief.js"

checkdep() { type -p $1 &>/dev/null; }

alert="\e[1;34m"
notice="\e[1;39m"
warn="\e[1;33m"
fail="\e[1;31m"
reset="\e[0m"

if checkdep tidy; then
  echo -e "${alert}==>${reset} ${notice}Running 'tidy' HTML validation${reset}"
  output=$(tidy -qe "$html" 2>&1)
  [ ! -z "$output" ] && echo -e "${fail}==> FAIL${reset}" && echo "$output"
else
  echo -e "${warn}Missing tidy${reset}. Skipping HTML validation"
fi

if checkdep csslint; then
  echo -e "${alert}==>${reset} ${notice}Running 'csslint' CSS validation${reset}"
  output=$(csslint --quiet "$css" 2>&1)
  [ ! -z "$output" ] && echo -e "${fail}==> FAIL${reset}" && echo "$output"
else
  echo -e "${warn}Missing csslint${reset}. Skipping CSS validation"
fi

if checkdep jshint; then
  echo -e "${alert}==>${reset} ${notice}Running 'jshint' Javascript validation${reset}"
  output=$(jshint "$js" 2>&1)
  [ ! -z "$output" ] && echo -e "${fail}==> FAIL${reset}" && echo "$output"
else
  echo -e "${warn}Missing jshint${reset}. Skipping Javascript validation"
fi
