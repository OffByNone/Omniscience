class ServiceProperty {
    constructor() {
        this.datatype = null;
        this.name = null;
        this.defaultValue = null;
        this.evented = false;
        this.allowedValues = [];
        this.allowedValueRange = null;
    }
}

module.exports = ServiceProperty;