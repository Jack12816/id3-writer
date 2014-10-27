SHELL=/bin/bash
NPM=./node_modules/.bin

REPORTER ?= spec

all: test

test:
	@${NPM}/istanbul cover \
		${NPM}/_mocha \
			--report lcovonly \
			-- tests/ \
			--slow 600 \
			--timeout 2000 \
			--reporter $(REPORTER) \
		&& cat ./coverage/lcov.info \
		| ${NPM}/coveralls && rm -rf ./coverage

.PHONY: test

