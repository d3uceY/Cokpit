export namespace pip {
	
	export class OutdatedPackage {
	    name: string;
	    version: string;
	    latestVersion: string;
	    bumpType: string;
	
	    static createFrom(source: any = {}) {
	        return new OutdatedPackage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.version = source["version"];
	        this.latestVersion = source["latestVersion"];
	        this.bumpType = source["bumpType"];
	    }
	}
	export class Package {
	    name: string;
	    version: string;
	    latestVersion: string;
	    summary: string;
	    status: string;
	
	    static createFrom(source: any = {}) {
	        return new Package(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.version = source["version"];
	        this.latestVersion = source["latestVersion"];
	        this.summary = source["summary"];
	        this.status = source["status"];
	    }
	}

}

