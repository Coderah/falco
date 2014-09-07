default: test

test:
	@./node_modules/mocha/bin/mocha -w --recursive --reporter mocha-unfunk-reporter -c

.PHONY: test