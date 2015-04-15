omniscience.factory('contentDirectoryService', function ($rootScope, eventService, subscriptionService) {

	var rawServiceType = 'urn:schemas-upnp-org:service:ContentDirectory:1';
	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		getInfo: function getInfo() {
			this.getSearchCapabilities();
			this.getSortCapabilities();
			this.x_GetRemoteSharingStatus();
		},
		getSearchCapabilities: function getSearchCapabilities() {
			return eventService.callService(getService(), "GetSearchCapabilities");
		},
		getSortCapabilities: function getSortCapabilities() {
			return eventService.callService(getService(), "GetSortCapabilities");
		},
		getSystemUpdateID: function getSystemUpdateID() {
			return eventService.callService(getService(), "GetSystemUpdateID");
		},
		browse: function browse(objectId, browseFlag, filter, startingIndex, requestedCount, sortCriteria) {
			return eventService.callService(getService(), "Browse", { ObjectId: objectId, BrowseFlag: browseFlag, Filter: filter, StartingIndex: startingIndex, RequestedCount: requestedCount, SortCriteria: sortCriteria });
		},
		search: function search(containerId, searchCriteria, filter, startingIndex, requestedCount, sortCriteria) {
			return eventService.callService(getService(), "Search", { ContainerId: containerId, SearchCriteria: searchCriteria, Filter: filter, StartingIndex: startingIndex, RequestedCount: requestedCount, SortCriteria: sortCriteria });
		},
		x_GetRemoteSharingStatus: function x_GetRemoteSharingStatus() {
			return eventService.callService(getService(), "X_GetRemoteSharingStatus");
		},
		subscribe: function (genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function () {
			return subscriptionService.unsubscribe(getService());
		}
	};
});