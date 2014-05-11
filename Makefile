SHELL=/bin/bash
NPM=./node_modules/.bin

REPORTER ?= spec

all: test

test:
	@${NPM}/_mocha --slow 600 --timeout 2000 --reporter $(REPORTER) tests/

.PHONY: test

