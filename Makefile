.PHONY: upload deploy

upload:
	npm run upload --prefix highlight-reel

deploy:
	npm run deploy --prefix highlight-service

install:
	npm i --prefix highlight-reel
	npm i --prefix highlight-service

clean:
	rm -rf ./highlight-reel/node_modules
	rm -rf ./highlight-reel/dist
	rm -rf ./highlight-service/node_modules
	rm -rf ./highlight-service/.esbuild
	rm -rf ./highlight-service/.serverless

clean-install: clean install

