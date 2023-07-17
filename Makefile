.PHONY: upload deploy

upload:
	npm run upload --prefix highlight-reel

deploy:
	npm run deploy --prefix highlight-service
