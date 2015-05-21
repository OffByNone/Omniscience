const Constants = require('../Utilities/Constants');

class ServiceExecutor {
    constructor (serviceInfoFactory, executableServiceFactory, pubSub){
        this._executableServiceFactory = executableServiceFactory;
        this._serviceInfoFactory = serviceInfoFactory;
        this._executableServices = {};
        this._pubSub = pubSub;

        this._pubSub.sub('CallService', (uniqueId, service, serviceMethod, data) =>
        	this.callService(service.controlUrl, service.hash, serviceMethod, data).
				then((response) => this._pubSub.pub("emitResponse", uniqueId, response)));
    }
    callService(serviceControlUrl, serviceHash, serviceMethod, data){
        if(!serviceControlUrl || !serviceMethod)
            return;

        var serviceClass = this._executableServices[serviceHash];
        if(!serviceClass) return Promise.reject("Executable Service has not yet been created.");

        var serviceFunc = serviceClass[serviceMethod];
        if(typeof serviceFunc !== "function") return Promise.reject("Executable Service has been created, but, service function has not.");

        return serviceFunc(serviceControlUrl, data);
    }
    addExecutableServices(services){
        if(!Array.isArray(services)) return;
        services.forEach((basicServiceInfo) => {
            this._serviceInfoFactory.getDetailedServiceInformation(basicServiceInfo).then((detailedServiceInfo) => {
                var executableService = this._executableServiceFactory.create(detailedServiceInfo);
                if(!executableService) return;
                if(!this._executableServices.hasOwnProperty(detailedServiceInfo.hash))
                    this._executableServices[detailedServiceInfo.hash] = executableService;
                else
                    for (var methodName in executableService)
                        this._executableServices[detailedServiceInfo.hash][methodName] = executableService[methodName];
            }).catch(()=>{});
        });
    }
}

module.exports = ServiceExecutor;