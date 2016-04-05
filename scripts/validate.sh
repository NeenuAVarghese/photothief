#!/bin/bash

html="index.html"
html2="victim/index.html"
css="stylesheets/photothief.css"
css2="stylesheets/victim.css"
js="js/photothief.js"
js2="js/victim.js"

checkdep() { type -p $1 &>/dev/null; }

alert="\e[1;34m"
notice="\e[1;39m"
warn="\e[1;33m"
fail="\e[1;31m"
reset="\e[0m"

if checkdep tidy; then
  echo -e "${alert}==>${reset} ${notice}Running 'tidy' HTML validation${reset}"
  output=$(tidy -qe "$html" 2>&1)
  [ ! -z "$output" ] && echo -e "${fail}==> FAIL${reset} $html" && echo "$output"
  output2=$(tidy -qe "$html2" 2>&1)
  [ ! -z "$output2" ] && echo -e "${fail}==> FAIL${reset} $html2" && echo "$output2"
else
  echo -e "${warn}Missing tidy${reset}. Skipping HTML validation"
fi

if checkdep csslint; then
  echo -e "${alert}==>${reset} ${notice}Running 'csslint' CSS validation${reset}"
  output=$(csslint --quiet "$css" 2>&1)
  [ ! -z "$output" ] && echo -e "${fail}==> FAIL${reset} $css" && echo "$output"
  output2=$(csslint --quiet "$css2" 2>&1)
  [ ! -z "$output2" ] && echo -e "${fail}==> FAIL${reset} $css2" && echo "$output2"
else
  echo -e "${warn}Missing csslint${reset}. Skipping CSS validation"
fi

if checkdep jshint; then
  echo -e "${alert}==>${reset} ${notice}Running 'jshint' Javascript validation${reset}"
  output=$(jshint "$js" 2>&1)
  [ ! -z "$output" ] && echo -e "${fail}==> FAIL${reset} $js" && echo "$output"
  output2=$(jshint "$js2" 2>&1)
  [ ! -z "$output2" ] && echo -e "${fail}==> FAIL${reset} $js2" && echo "$output2"
else
  echo -e "${warn}Missing jshint${reset}. Skipping Javascript validation"
fi
