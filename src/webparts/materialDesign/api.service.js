var ApiServices = /** @class */ (function () {
    function ApiServices() {
        this.baseUrl = _spPageContextInfo.webAbsoluteUrl;
        this.baseRelativeUrl = _spPageContextInfo.webServerRelativeUrl;
        this.tenantBaseUrl = (_spPageContextInfo.webAbsoluteUrl).replace(_spPageContextInfo.webServerRelativeUrl, '');
    }

    /**
     *Perform a HTTP post request
     * @param {string} endpoint : the path and any other optional query parameters
     * @param payload : Object containing data to be posted
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {promise}
     */
    ApiServices.prototype.createResource = function (endpoint, payload, useBaseUrl) {
        return $.ajax({
            url: useBaseUrl ? this.tenantBaseUrl + endpoint : this.baseUrl + endpoint,
            type: 'POST',
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(payload)
        });
    };
    /**
     * Perform HTTP post request on a binary resource e.g file
     * @param {string} endpoint
     * @param fileStream
     * @param xhrCallback :callback function
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {Promise}
     */
    ApiServices.prototype.createBinaryResource = function (endpoint, fileStream, xhrCallback, useBaseUrl) {
        return $.ajax({
            type: 'POST',
            url: useBaseUrl ? this.tenantBaseUrl + endpoint : this.baseUrl + endpoint,
            data: fileStream,
            processData: false,
            xhr: xhrCallback,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose"
            }
        });
    };
    /**
     * Perform a HTTP GET request to retrieve a resource
     * @param {string} endpoint : the path and any other optional query parameters
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @returns {Promise<>} returns ajax type promise
     */
    ApiServices.prototype.getResource = function (endpoint, useBaseUrl) {
        return $.ajax({
            async: false,
            url: useBaseUrl ? this.tenantBaseUrl + endpoint : this.baseUrl + endpoint,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose"
            }
        }).promise();
    };
    /**
     * Perform HTTP Patch request to update a record
     * @param endPoint
     * @param payload
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {Promise}
     */
    ApiServices.prototype.updateResource = function (endPoint, payload, useBaseUrl) {
        return $.ajax({
            url: useBaseUrl ? this.tenantBaseUrl + endPoint : this.baseUrl + endPoint,
            type: 'PATCH',
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose",
                "X-Http-Method": "PATCH",
                "If-Match": "*"
            },
            data: JSON.stringify(payload)
        });
    };
    /**
     * Delete resource
     * @param endPoint
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {Promise}
     */
    ApiServices.prototype.deleteResource = function (endPoint, useBaseUrl) {
        return $.ajax({
            url: useBaseUrl ? this.tenantBaseUrl + endPoint : this.baseUrl + endPoint,
            type: 'DELETE',
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "X-Http-Method": "DELETE",
                "If-Match": "*"
            }
        });
    };
    /**
     * Maps valid url query options object to a url string
     *
     *@param expandColumns : Array object of lookup fields []
     *@param columnsToSelect : Array object of selectable columns []
     *@param filterOptions :object of key and value {} with and query condition
     *@param orFilterOptions :object of key and value {} with or query condition
     *
     * @return string : query in string url format
     */
    ApiServices.prototype.buildUrlQuery = function (expandColumns, columnsToSelect, filterOptions, orFilterOptions) {
        var tempUrlParam = "";
        if (columnsToSelect) {
            tempUrlParam = '$select=' + columnsToSelect.join(',');
        }
        if (expandColumns) {
            if (tempUrlParam) {
                tempUrlParam += '&'; //add & to concat the options
            }
            tempUrlParam += "$expand=" + expandColumns.join(',');
        }
        var andOptions = [];
        var orOptions = [];
        if (filterOptions) {
            Object.keys(filterOptions).forEach(function (key) {
                andOptions.push('(' + key + ' ' + filterOptions[key] + ')');
            });
        }
        if (orFilterOptions) {
            Object.keys(orFilterOptions).forEach(function (key) {
                orOptions.push('(' + key + ' ' + orFilterOptions[key] + ')');
            });
        }
        if (andOptions.length > 0 || orOptions.length > 0) {
            if (tempUrlParam) {
                tempUrlParam += '&';
            }
            if (andOptions.length > 0 && orOptions.length > 0) {
                tempUrlParam += '$filter=(' + andOptions.join(' and ') + ' and (' + orOptions.join(' or ') + '))';
            } else if (andOptions.length > 0) {
                tempUrlParam += '$filter=(' + andOptions.join(' and ') + ')';
            } else {
                tempUrlParam += '$filter=(' + orOptions.join(' or ') + ')';
            }
        }
        return tempUrlParam;
    };
    // list operations
    ApiServices.prototype.fetchAllLists = function (useBaseUrl) {
        return this.getResource('/_api/Web/Lists', useBaseUrl);
    };
    ApiServices.prototype.fetchListId = function (listIdentity, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + listIdentity + "')?$select=Id", useBaseUrl);
    };
    ApiServices.prototype.fetchListDefaultView = function (listIdentity, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + listIdentity + "')/DefaultView?$select=Id", useBaseUrl);
    };
    ApiServices.prototype.fetchListByIdentity = function (identity, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + identity + "')", useBaseUrl);
    };
    ApiServices.prototype.fetchListPropertiesByIdentity = function (identity, queryOptions, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + identity + "')?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.fetchListFields = function (identity, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + identity + "')/Fields", useBaseUrl);
    };
    ApiServices.prototype.fetchListItems = function (identity, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + identity + "')/Items", useBaseUrl);
    };
    ApiServices.prototype.fetchListItemsAfterQuery = function (listIdentity, queryOptions, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + listIdentity + "')/Items?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.fetchGroupUsersByName = function (listName, queryOptions, useBaseUrl) {
        return this.getResource("/_api/web/sitegroups/getbyname('" + listName + "')/users?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.fetchGroupUsersById = function (listID, queryOptions, useBaseUrl) {
        return this.getResource("/_api/web/sitegroups('" + listID + "')/users?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.fetchListFieldDetails = function (listIdentity, fieldName, useBaseUrl) {
        return this.getResource("/_api/Web/Lists/GetByTitle('" + listIdentity + "') Fields/GetByTitle('" + fieldName + "')", useBaseUrl);
    };
    ApiServices.prototype.fetchListItemById = function (listIdentity, fieldID) {
        return this.getResource("/_api/web/lists/GetByTitle('" + listIdentity + "')/GetItemById(" + fieldID + ")");
    };
    ApiServices.prototype.fetchListUniqueItems = function (listIdentity, selectField, useBaseUrl) {
        this.fetchListId(listIdentity, useBaseUrl)
            .then(function (res) {
                var listObj = res.d.results[0];
                if (listObj) {
                    new ApiServices()
                        .fetchListDefaultView(listIdentity, useBaseUrl)
                        .then(function (res) {
                            var viewObject = res.d.results[0];
                            if (viewObject) {
                                new ApiServices()
                                    .getResource("/_layouts/15/filter.aspx?ListId={" + listObj.Id + "}" +
                                        ("&FieldInternalName='" + selectField + "'&ViewId={" + viewObject.Id + "&FilterOnly=1&Filter=2"), useBaseUrl);
                            }
                        });
                }
            });
    };
    ApiServices.prototype.getListItemsCount = function (listIdentity, useBaseUrl) {
        return this.getResource("/_api/web/lists/GetByTitle('" + listIdentity + "')/ItemCount", useBaseUrl);
    };
    ApiServices.prototype.getListItemsCountAfterQuery = function (listIdentity, queryOptions, useBaseUrl) {
        return this.getResource("/_vti_bin/listdata.svc/" + listIdentity + "/$count?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.addListItem = function (listIdentity, data, useBaseUrl) {
        return this.createResource("/_api/web/lists/GetByTitle('" + listIdentity + "')/Items", data, useBaseUrl);
    };
    ApiServices.prototype.updateListItemById = function (listIdentity, fieldID, data, useBaseUrl) {
        return this.updateResource("/_api/web/lists/GetByTitle('" + listIdentity + "')/GetItemById(" + fieldID + ")", data, useBaseUrl);
    };
    ApiServices.prototype.deleteListItemById = function (listIdentity, fieldID, useBaseUrl) {
        return this.deleteResource("/_api/web/lists/GetByTitle('" + listIdentity + "')/GetItemById(" + fieldID + ")", useBaseUrl);
    };
    /**
     * Upload binary file to a specified list
     * @param listIdentity :the list id or name
     * @param elementId :file input element id
     * @param payload: any metadata associated with the file {this metadata should align to that of updating list item}
     * @param successFn: callback function to be executed on successful upload : params include all file metadata
     * @param failedFn: callback function to be executed on failure to upload fully the file+metadata
     * @param xhrCallback: callback on ajax xhr
     * @return null
     */
    ApiServices.prototype.uploadBinaryFile = function (listIdentity, elementId, payload, successFn, failedFn, xhrCallback) {
        var _this = this;
        if (!window.FileReader) {
            console.log('browser not supported');
            return;
        }
        var elemRef = document.getElementById(elementId);
        var fileRef = elemRef.files[0];
        var fileName = +new Date() + fileRef.name;
        var reader = new FileReader();
        reader.onload = function (e) {
            _this.createBinaryResource("/_api/Web/Lists/getByTitle('" + listIdentity + "')" +
                "/RootFolder/Files/Add(url='" + fileName + "',overwrite=false)", e.target.result, xhrCallback)
                .done(function (data) {
                    new ApiServices()
                        .getResource("/_api/Web/" + data.d.ListItemAllFields.__deferred.uri.split('/_api/Web/')[1])
                        .done(function (data) {
                            if (!payload) {
                                successFn(data);
                                return;
                            }
                            new ApiServices()
                                .updateListItemById(listIdentity, data.d.Id, payload)
                                .done(function () {
                                    successFn(data);
                                })
                                .fail(function (xhr, status, error) {
                                    failedFn(xhr, status, error);
                                });
                        })
                        .fail(function (xhr, status, error) {
                            failedFn(xhr, status, error);
                        });
                }).fail(function (xhr, status, error) {
                failedFn(xhr, status, error);
            });
        };
        reader.onerror = function (e) {
            console.log('file not uploaded', e.target.error);
        };
        reader.readAsArrayBuffer(fileRef);
    };
    ApiServices.prototype.fetchLibraryFolders = function (listIdentity, queryOptions, useBaseUrl) {
        return this.getResource("/_api/Web/GetFolderByServerRelativeUrl('" + listIdentity + "')/Folders?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.fetchLibraryFiles = function (listIdentity, queryOptions, useBaseUrl) {
        return this.getResource("/_api/Web/GetFolderByServerRelativeUrl('" + listIdentity + "')/Files?" + queryOptions, useBaseUrl);
    };
    ApiServices.prototype.fetchLibraryFoldersAndFiles = function (listIdentity, useBaseUrl) {
        return this.getResource("/_api/Web/GetFolderByServerRelativeUrl('" + listIdentity + "')?$expand=Folders,Files", useBaseUrl);
    };
    /**
     * Fetch the current logged user data
     * @param selectColumns :optional ..array of columns to select
     * @return {Promise<>} Ajax promise
     */
    ApiServices.prototype.fetchCurrentUserData = function (selectColumns) {
        if (selectColumns) {
            return this.getResource("/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=" +
                selectColumns.join(','));
        } else {
            return this.getResource("/_api/SP.UserProfiles.PeopleManager/GetMyProperties");
        }
    };
    /**
     * Returns the server time based on last server request {do not use this to get the real time }
     * @return {Date}
     */
    ApiServices.prototype.getServerTime = function () {
        // return new Date(new Date(_spPageContextInfo.serverTime).getTime() + _spPageContextInfo.clientServerTimeDelta);
        return new Date(_spPageContextInfo.serverTime);
    };
    ApiServices.prototype.getCurrentUserID = function () {
        return _spPageContextInfo.userId;
    };
    ApiServices.prototype.getCurrentUserEmail = function () {
        return _spPageContextInfo.userEmail;
    };
    /**
     * Return the difference of days between two dates minus the weekend days found
     *
     * @param startDate
     * @param endDate
     * @return {number}
     */
    ApiServices.prototype.getBusinessDaysDiffCount = function (startDate, endDate) {
        var daysDiff;
        var daysAfterLastSunday;
        var daysBeforeFirstSunday;
        var start;
        var stop;
        start = new Date(startDate);
        stop = new Date(endDate);
        var compareFn = function (a, b, c) {
            return a === b ? c : a;
        };
        daysDiff = stop - start;
        daysDiff /= 86400000;
        daysBeforeFirstSunday = (7 - start.getDay()) % 7;
        daysAfterLastSunday = stop.getDay();
        daysDiff -= (daysBeforeFirstSunday + daysAfterLastSunday);
        daysDiff = (daysDiff / 7) * 5;
        daysDiff += compareFn(daysBeforeFirstSunday - 1, -1, 0) + compareFn(daysAfterLastSunday, 6, 5);
        return parseInt(daysDiff);
    };
    /**
     * Add +/- days to a specified date
     * @param curDate
     * @param days
     * @return {Date}
     */
    ApiServices.prototype.addDaysToDate = function (curDate, days) {
        var prev = new Date(curDate);
        prev.setDate(prev.getDate() + days);
        return prev;
    };
    ApiServices.prototype.addBusinessDaysToDate = function (start, days) {
        var prev = new Date(start);
        var isWeekend = false;
        while (days) {
            prev.setDate(prev.getDate() + 1);
            isWeekend = prev.getDay() === 0 || prev.getDay() === 6;
            if (!isWeekend) {
                days--;
            }
        }
        return prev;
    };
    ApiServices.prototype.addHoursToTime = function (time, offset) {
        var d = new Date(time.replace(/T|:\d\dZ/g, ' ').trim());
        d.setTime(d.getTime() + (offset * 60 * 60 * 1000));
        return d;
    };
    /**
     * Get the days difference between two days
     * @param start :date in ISO string format
     * @param end :date in ISO string format
     * @return {number}
     */
    ApiServices.prototype.getDaysDifference = function (start, end) {
        return Math.floor((new Date(start).getTime() - new Date(end).getTime()) / (1000 * 60 * 60 * 24)); //milliseconds per day
    };
    /**
     * Returns the last date of specified month and year
     * @param month
     * @param year
     */
    ApiServices.prototype.getLastDateOfMonth = function (month, year) {
        console.log(new Date().toLocaleDateString('en-US'), "after", new Date(year, month, 0).toLocaleDateString('en-US'));
        return new Date(year, month, 0).toLocaleDateString('en-US');
    };
    ApiServices.prototype.getFirstDateOfMonth = function (month, year) {
        return new Date(year, month, 1).toLocaleDateString('en-US');
    };
    /**
     * Check an input if it has value
     * @param input
     * @param include
     * @param fnOnError
     */
    ApiServices.prototype.checkInput = function (input, include, fnOnError) {
        var errors = 0;
        if ((input.readOnly || input.hidden || input.disabled ||
            !ApiServices.inputVisible(input))) { //if disabled,hidden or read only
            if (include && include.indexOf(input.id) === -1) { // if not included, pass
                if (input.type === 'number') {
                    if (isNaN(input.value)) {
                        $('#' + input.id).addClass('has-error');
                        if (fnOnError) {
                            fnOnError(input);
                        }
                        errors++;
                    }
                } else if (!input.value) {
                    $('#' + input.id).addClass('has-error');
                    if (fnOnError) {
                        fnOnError(input);
                    }
                    errors++;
                }
            }
        } else {
            if (!input.value) {
                $('#' + input.id).addClass('has-error');
                if (fnOnError) {
                    fnOnError(input);
                }
                errors++;
            }
        }
        //attach a reset mechanism on keyup and keyenter
        $("#" + input.id).on('keyup keyenter focus change', function (evt) {
            $(evt.target).removeClass('has-error');
        });
        return errors;
    };
    /**
     *
     * @param formId  :the ID of the form
     * @param validationOptions :Object including
     *            @key include :array of input IDS to include in validation
     *            @key exclude :array of input IDS to eclude from validation
     *            @key fnOnEachError :function callback to execute on each error executed (has input as parameter)
     * @param fnOnError :function to execute if form has error
     * @param fnSuccess : function to execute if form has no error
     */
    ApiServices.prototype.validateForm = function (formId, validationOptions, fnOnError, fnSuccess) {
        var _this = this;
        var include = null, exclude = null, fnOnEachError = null;
        var errorsCount = 0;
        var input;
        if (validationOptions) {
            include = validationOptions['include'];
            exclude = validationOptions['exclude'];
            fnOnEachError = validationOptions['fnOnEachError'];
        }
        $('#' + formId + ' :input').map(function (index, elem) {
            input = $(elem)[0];
            if (input.type === 'text' || input.tagName === 'SELECT' ||
                input.type === 'number' || input.type === 'textarea' || input.type === "file") {
                if (!exclude || (exclude && exclude.indexOf(input.id) === -1)) { //if there is excluded list and it does not exist
                    errorsCount += _this.checkInput(input, include, fnOnEachError);
                }
            }
        });
        if (fnOnError && errorsCount > 0) {
            fnOnError();
        } else if (fnSuccess && errorsCount === 0) {
            fnSuccess();
        }
    };
    /**
     * Checks if element is visible or hidden
     * @param {HTMLElement} elem
     * @return {Boolean}
     */
    ApiServices.inputVisible = function (elem) {
        if (!(elem instanceof Element))
            throw Error('DOM Utility: parameter in inputVisible is not an element');
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    };
    ApiServices.prototype.showErrorMessage = function (message) {
        this.notify('error', message);
    };
    ApiServices.prototype.showSuccessMessage = function (message, onOk) {
        this.notify('success', '<p class="pt-3">' + message + '</p>', null, onOk);
    };
    ApiServices.prototype.notify = function (type, message, btnType, onBtnClick) {
        if (!btnType) {
            btnType = 'dark';
        }
        if (type === 'success') {
            $('#js-ok-notify').removeClass('no-display');
            $('#js-error-notify').addClass('no-display');
            $('#js-alert-btn').addClass('btn-' + btnType);
        } else if (type === 'error') {
            $('#js-error-notify').removeClass('no-display');
            $('#js-ok-notify').addClass('no-display');
            $('#js-alert-btn').addClass('btn-' + btnType);
        }
        $('#js-alert-message').html(message);
        var modal = $('#alertModal');
        if (onBtnClick) {
            modal.on('hidden.bs.modal', function () {
                onBtnClick();
            });
        }
        modal.modal();
    };
    /**
     * Show a native sharePoint modal dialog (cannot be closed by user) with a progress loader
     * @param message
     */
    ApiServices.prototype.showProgressLoader = function (message) {
        var elem = document.createElement('div');
        elem.className = 'progress-loader';
        return SP.UI.ModalDialog.showModalDialog({
            html: elem,
            title: message || "Uploading document..",
            allowMaximize: false,
            showClose: false,
            autoSize: false,
            width: 300,
            height: 200
        });
    };
    ApiServices.prototype.reloadWindow = function () {
        //reset all form fields first
        $(':input')
            .not(':button, :submit, :reset, :hidden,[readonly]')
            .removeAttr('checked').removeAttr('selected')
            .not(':checkbox, :radio, select').val('');
        window.location.reload();
    };
    return ApiServices;
}());
/*** Application constants ****/
var employeeList = {
    listItemsRef: null,
    name: 'employees'
};
var departmentList = {
    listItemsRef: null,
    name: 'departments'
};
var leaveRequestList = {
    listItemsRef: null,
    name: 'LeaveRequests' //leave requests
};
var leaveDaysAccount = {
    listItemsRef: null,
    name: 'LeaveDaysAccount'
};
var donorsList = {
    listItemsRef: null,
    name: 'Donors'
};
var travelAttachmentList = {
    listItemsRef: null,
    name: 'TravelAttachments'
};
var travelRequestList = {
    listItemsRef: null,
    name: 'TravelRequests'
};
var ticketRequestList = {
    listItemsRef: null,
    name: "TicketRequests"
};
var eventsList = {
    listItemsRef: null,
    name: 'Events'
};
var newsList = {
    listItemsRef: null,
    name: 'News'
};
var keyPeopleList = {
    listItemsRef: null,
    name: 'keyPeople'
};
var sharedDocsList = {
    listItemsRef: null,
    name: 'Documents'
};
var quickLinks = {
    listItemsRef: null,
    name: 'QuickLinks'
};
var helpDeskIssuesList = {
    listItemsRef: null,
    name: 'HelpDeskIssues'
};
var currenciesList = {
    listItemsRef: null,
    name: 'CurrencyList'
};
var cabRequestsList = {
    listItemsRef: null,
    name: 'CabRequests'
};
var donorsBudgetLines = {
    listItemsRef: null,
    name: 'BudgetLine'
};
var departmentEventsList = {
    listItemsRef: null,
    name: 'Calendar'
};
var departmentsFeaturedList = {
    listItemsRef: null,
    name: 'DepartmentsFeatured'
};
var pettyCashList = {
    listItemsRef: null,
    name: 'PettyCash'
};
var pettyCashSurrenderList = {
    listItemsRef: null,
    name: 'PettyCashSurrender'
};
var stationeryRequestList = {
    listItemsRef: null,
    name: 'StationeryRequests'
};
var stationeryIssueHistoryList = {
    listItemsRef: null,
    name: 'StationeryIssueHistory'
};
var stationeryInventoryItemsList = {
    listItemsRef: null,
    name: 'InventoryItems'
};
var salaryAdvanceRequestList = {
    listItemsRef: null,
    name: 'SalaryAdvanceRequests'
};
var payrollDataList = {
    listItemsRef: null,
    name: 'PayrollData'
};
var purchaseRequestList = {
    listItemsRef: null,
    name: 'PurchaseRequsitionRequest'
};
var UOMList = {
    listItemsRef: null,
    name: 'Unit%20of%20measure'
};
var leaveHistoryList = {
    listItemsRef: null,
    name: 'LeaveDaysTakenHistory'
};
var expenseTypesList = {
    listItemsRef: null,
    name: 'NatureList'
};
var cabInvoiceList = {
    listItemsRef: null,
    name: 'CabInvoices'
};
var condensedPurchaseRequestsList = {
    listItemsRef: null,
    name: 'CondensedPurchaseRequests'
};
var sitePagesList = {
    listItemsRef: null,
    name: 'Site Pages'
};
var helpNotesList = {
    listItemsRef: null,
    name: 'HelpNotes'
};
//Groups
var adminUserGroup = {
    name: 'Admin'
};
var financeUserGroup = {
    name: 'Finance'
};
var helpSupportUserGroup = {
    name: 'Help Desk Support'
};
var HRUserGroup = {
    name: 'Hr'
};
var supervisorsGroup = {
    name: 'Supervisors'
};
var storeKeeperGroup = {
    name: 'Store keeper'
};
var executiveDirectorGroup = {
    name: 'ED'
};
var budgetHoldersGroup = {
    name: 'Budget Holders'
};
var ProcurementUsersGroup = {
    name: 'Procurement'
};
var currencyConversionApi = 'http://www.apilayer.net/api/live' +
    '?access_key=1691affb25e07cec46aa48a32824f89f&format=1&currencies=USD,GBP,KES,EUR';
$(function () {
    $('#s4-workspace').scroll(function () {
        if (this.scrollTop > 42) {
            $('#app-header').addClass("fixed-app-header");
        } else {
            $('#app-header').removeClass("fixed-app-header");
        }
    });
});
