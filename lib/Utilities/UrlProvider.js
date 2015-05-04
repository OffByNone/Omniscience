class UrlProvider {
    constructor(urlSdk) {
        this._urlSdk = urlSdk;
    }

    toUrl(path, currentUrl, baseUrl) {
        //returns null for undefined, and /ssdp/notfound paths as well as invalid Urls
        if (!path || path.length === 0 || path === '/ssdp/notfound')
            return null;
        if (this._urlSdk.isValidURI(path))
            return this.createUrl(path);
        try {
            return this.createUrl(path, baseUrl);
        } catch (e) { }
        try {
            return this.createUrl(path, currentUrl);
        } catch (e) { }

        return null;
    }

    createUrl(source, base) {
        return new this._urlSdk.URL(source, base);
    }

    isValidURI(path) {
        return this._urlSdk.isValidURI(path);
    }
}

module.exports = UrlProvider;