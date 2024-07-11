
all:
	if ! test -d lambda/node_modules; then make -C lambda install; fi
	if ! test -d node_modules; then npm install; fi
	make -C lambda all

clean:
	make -C lambda clean
	rm -rf cdk.out

dist-clean: clean
	make -C lambda dist-clean

deploy:
	cdk bootstrap
	cdk deploy

destroy:
	cdk destroy

help:
	@echo "make                  compile the javascript file"
	@echo "make clean            clean the compiled javascript files"
	@echo "make dist-clean       deep clean for releasing the package"
	@echo "make deploy           deploy the cloud stack"
	@echo "make destroy          destroy and clean up the cloud stack"


