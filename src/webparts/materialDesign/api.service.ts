class ApiServices {

    readonly baseUrl = _spPageContextInfo.webAbsoluteUrl;
    readonly baseRelativeUrl = _spPageContextInfo.webServerRelativeUrl;
    readonly tenantBaseUrl = (_spPageContextInfo.webAbsoluteUrl).replace(_spPageContextInfo.webServerRelativeUrl, '');

    /**
     *Perform a HTTP post request
     * @param {string} endpoint : the path and any other optional query parameters
     * @param payload : Object containing data to be posted
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {promise}
     */
    createResource(endpoint: string, payload, useBaseUrl?: boolean): JQuery.Promise<any> {
        return $.ajax({
            url: useBaseUrl ? this.tenantBaseUrl + endpoint : this.baseUrl + endpoint,
            type: 'POST',
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(payload)
        })
    }

    /**
     * Perform HTTP post request on a binary resource e.g file
     * @param {string} endpoint
     * @param fileStream
     * @param xhrCallback :callback function
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {Promise}
     */
    createBinaryResource(endpoint: string, fileStream, xhrCallback?: any, useBaseUrl?: boolean): JQuery.Promise<any> {
        return $.ajax({
            type: 'POST',
            url: useBaseUrl ? this.tenantBaseUrl + endpoint : this.baseUrl + endpoint,
            data: fileStream,
            processData: false,
            xhr: xhrCallback,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose",
            }
        })
    }

    /**
     * Perform a HTTP GET request to retrieve a resource
     * @param {string} endpoint : the path and any other optional query parameters
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @returns {Promise<>} returns ajax type promise
     */
    getResource(endpoint: string, useBaseUrl?: boolean): JQuery.Promise<any> {
        return $.ajax({
            url: useBaseUrl ? this.tenantBaseUrl + endpoint : this.baseUrl + endpoint,
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val().toString(),
                "content-Type": "application/json;odata=verbose"
            }
        }).promise()
    }

    /**
     * Perform HTTP Patch request to update a record
     * @param endPoint
     * @param payload
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {Promise}
     */
    updateResource(endPoint, payload, useBaseUrl?: boolean): JQuery.Promise<any> {
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
    }

    /**
     * Delete resource
     * @param endPoint
     * @param useBaseUrl: should tenant base url be used. Default is false
     * @return {Promise}
     */
    deleteResource(endPoint, useBaseUrl?: boolean): JQuery.Promise<any> {
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
    }

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
    buildUrlQuery(expandColumns?: string[], columnsToSelect?: string[], filterOptions ?: {}, orFilterOptions?: {}): string {
        let tempUrlParam = "";

        if (columnsToSelect) {
            tempUrlParam = '$select=' + columnsToSelect.join(',');
        }

        if (expandColumns) {
            if (tempUrlParam) {
                tempUrlParam += '&'; //add & to concat the options
            }
            tempUrlParam += "$expand=" + expandColumns.join(',');
        }

        let andOptions = [];
        let orOptions = [];

        if (filterOptions) {
            Object.keys(filterOptions).forEach(function (key) {
                andOptions.push('(' + key + ' ' + filterOptions[key] + ')');
            });

        }
        if (orFilterOptions) {

            Object.keys(orFilterOptions).forEach(function (key) {
                orOptions.push('(' + key + ' ' + orFilterOptions[key] + ')');
            })
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
    }

    // list operations

    fetchAllLists(useBaseUrl?: boolean): Promise<any> {
        return this.getResource('/_api/Web/Lists', useBaseUrl);
    }

    fetchListId(listIdentity, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${listIdentity}')?$select=Id`, useBaseUrl);
    }

    fetchListDefaultView(listIdentity, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${listIdentity}')/DefaultView?$select=Id`, useBaseUrl);
    }

    fetchListByIdentity(identity, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${identity}')`, useBaseUrl);
    }

    fetchListPropertiesByIdentity(identity, queryOptions?: string, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${identity}')?${queryOptions}`, useBaseUrl);
    }

    fetchListFields(identity, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${identity}')/Fields`, useBaseUrl);
    }

    fetchListItems(identity, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${identity}')/Items`, useBaseUrl);
    }

    fetchListItemsAfterQuery(listIdentity: string, queryOptions: string, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${listIdentity}')/Items?${queryOptions}`, useBaseUrl);
    }

    fetchGroupUsersByName(listName: string, queryOptions: string, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/web/sitegroups/getbyname('${listName}')/users?${queryOptions}`, useBaseUrl);
    }

    fetchGroupUsersById(listID: string, queryOptions: string, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/web/sitegroups('${listID}')/users?${queryOptions}`, useBaseUrl);
    }

    fetchListFieldDetails(listIdentity, fieldName, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/Lists/GetByTitle('${listIdentity}') Fields/GetByTitle('${fieldName}')`, useBaseUrl);
    }

    fetchListItemById(listIdentity, fieldID): Promise<any> {
        return this.getResource(`/_api/web/lists/GetByTitle('${listIdentity}')/GetItemById(${fieldID})`);
    }

    fetchListUniqueItems(listIdentity, selectField, useBaseUrl?: boolean) {
        this.fetchListId(listIdentity, useBaseUrl)
            .then(function (res) {
                let listObj = res.d.results[0];

                if (listObj) {
                    new ApiServices()
                        .fetchListDefaultView(listIdentity, useBaseUrl)
                        .then(function (res) {
                            let viewObject = res.d.results[0];
                            if (viewObject) {
                                new ApiServices()
                                    .getResource(`/_layouts/15/filter.aspx?ListId={${listObj.Id}}` +
                                        `&FieldInternalName='${selectField}'&ViewId={${viewObject.Id}&FilterOnly=1&Filter=2`, useBaseUrl)
                            }
                        })

                }

            })

    }

    getListItemsCount(listIdentity, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/web/lists/GetByTitle('${listIdentity}')/ItemCount`, useBaseUrl);
    }

    getListItemsCountAfterQuery(listIdentity, queryOptions?: string, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_vti_bin/listdata.svc/${listIdentity}/$count?${queryOptions}`, useBaseUrl);
    }

    addListItem(listIdentity, data: {}, useBaseUrl?: boolean): Promise<any> {
        return this.createResource(`/_api/web/lists/GetByTitle('${listIdentity}')/Items`, data, useBaseUrl);
    }

    updateListItemById(listIdentity: string, fieldID: number, data: {}, useBaseUrl?: boolean): JQuery.Promise<any> {
        return this.updateResource(`/_api/web/lists/GetByTitle('${listIdentity}')/GetItemById(${fieldID})`, data, useBaseUrl);
    }

    deleteListItemById(listIdentity, fieldID, useBaseUrl?: boolean): Promise<any> {
        return this.deleteResource(`/_api/web/lists/GetByTitle('${listIdentity}')/GetItemById(${fieldID})`, useBaseUrl);
    }

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
    uploadBinaryFile(listIdentity, elementId, payload, successFn, failedFn, xhrCallback?) {
        if (!(<any>window).FileReader) {
            console.log('browser not supported');
            return;
        }
        let elemRef = document.getElementById(elementId);

        let fileRef = (<any>elemRef).files[0];
        let fileName = +new Date() + fileRef.name;

        let reader = new FileReader();
        reader.onload = (e) => {
            this.createBinaryResource("/_api/Web/Lists/getByTitle('" + listIdentity + "')" +
                "/RootFolder/Files/Add(url='" + fileName + "',overwrite=false)", (<any>e.target).result, xhrCallback)
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
                                })
                        })
                        .fail(function (xhr, status, error) {
                            failedFn(xhr, status, error);
                        })

                }).fail(function (xhr, status, error) {
                failedFn(xhr, status, error);
            })
        };

        reader.onerror = function (e) {
            console.log('file not uploaded', (<any>e.target).error)
        };

        reader.readAsArrayBuffer(fileRef);

    }

    fetchLibraryFolders(listIdentity, queryOptions, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/GetFolderByServerRelativeUrl('${listIdentity}')/Folders?${queryOptions}`, useBaseUrl);
    }

    fetchLibraryFiles(listIdentity, queryOptions, useBaseUrl?: boolean): Promise<any> {
        return this.getResource(`/_api/Web/GetFolderByServerRelativeUrl('${listIdentity}')/Files?${queryOptions}`, useBaseUrl);
    }

    fetchLibraryFoldersAndFiles(listIdentity, useBaseUrl?: boolean): Promise<any> {

        return this.getResource(`/_api/Web/GetFolderByServerRelativeUrl('${listIdentity}')?$expand=Folders,Files`, useBaseUrl);
    }

    /**
     * Fetch the current logged user data
     * @param selectColumns :optional ..array of columns to select
     * @return {Promise<>} Ajax promise
     */
    fetchCurrentUserData(selectColumns: string[]): Promise<any> {
        if (selectColumns) {
            return this.getResource("/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=" +
                selectColumns.join(','));
        } else {
            return this.getResource("/_api/SP.UserProfiles.PeopleManager/GetMyProperties");
        }
    }

    /**
     * Returns the server time based on last server request {do not use this to get the real time }
     * @return {Date}
     */
    getServerTime(): Date {
        // return new Date(new Date(_spPageContextInfo.serverTime).getTime() + _spPageContextInfo.clientServerTimeDelta);
        return new Date(_spPageContextInfo.serverTime);
    }

    getCurrentUserID(): number {
        return _spPageContextInfo.userId;
    }

    getCurrentUserEmail(): string {
        return _spPageContextInfo.userEmail;
    }

    /**
     * Return the difference of days between two dates minus the weekend days found
     *
     * @param startDate
     * @param endDate
     * @return {number}
     */
    getBusinessDaysDiffCount(startDate: string, endDate: string): number {
        let daysDiff;
        let daysAfterLastSunday;
        let daysBeforeFirstSunday;
        let start;
        let stop;
        start = new Date(startDate);
        stop = new Date(endDate);
        let compareFn = function (a, b, c) {
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
    }

    /**
     * Add +/- days to a specified date
     * @param curDate
     * @param days
     * @return {Date}
     */
    addDaysToDate(curDate: string, days: number): Date {
        let prev = new Date(curDate);
        prev.setDate(prev.getDate() + days);
        return prev;
    }

    addBusinessDaysToDate(start: string, days: number): Date {
        let prev = new Date(start);
        let isWeekend = false;
        while (days) {
            prev.setDate(prev.getDate() + 1);
            isWeekend = prev.getDay() === 0 || prev.getDay() === 6;
            if (!isWeekend) {
                days--;
            }
        }
        return prev;
    }

    addHoursToTime(time: string, offset: number): Date {
        let d = new Date(time.replace(/T|:\d\dZ/g, ' ').trim());
        d.setTime(d.getTime() + (offset * 60 * 60 * 1000));
        return d;
    }

    /**
     * Get the days difference between two days
     * @param start :date in ISO string format
     * @param end :date in ISO string format
     * @return {number}
     */
    getDaysDifference(start: string, end: string) {
        return Math.floor((new Date(start).getTime() - new Date(end).getTime()) / (1000 * 60 * 60 * 24)); //milliseconds per day
    }

    /**
     * Returns the last date of specified month and year
     * @param month
     * @param year
     */
    getLastDateOfMonth(month: number, year: number): string {
        console.log(new Date().toLocaleDateString('en-US'), "after", new Date(year, month, 0).toLocaleDateString('en-US'))
        return new Date(year, month, 0).toLocaleDateString('en-US');
    }

    getFirstDateOfMonth(month: number, year: number): string {
        return new Date(year, month, 1).toLocaleDateString('en-US');
    }

    /**
     * Check an input if it has value
     * @param input
     * @param include
     * @param fnOnError
     */
    private checkInput(input: any, include: string[], fnOnError: any) {
        let errors = 0;

        if ((input.readOnly || input.hidden || input.disabled ||
            !ApiServices.inputVisible(input))) { //if disabled,hidden or read only

            if (include && include.indexOf(input.id) === -1) { // if not included, pass

                if (input.type === 'number') {
                    if (isNaN(input.value)) {
                        $('#' + input.id).addClass('has-error');
                        if (fnOnError) {
                            fnOnError(input)
                        }
                        errors++;
                    }
                } else if (!input.value) {
                    $('#' + input.id).addClass('has-error');
                    if (fnOnError) {
                        fnOnError(input)
                    }
                    errors++;
                }
            }
        } else {
            if (!input.value) {
                $('#' + input.id).addClass('has-error');
                if (fnOnError) {
                    fnOnError(input)
                }
                errors++;
            }
        }

        //attach a reset mechanism on keyup and keyenter
        $(`#${input.id}`).on('keyup keyenter focus change', (evt) => {
            $(evt.target).removeClass('has-error');
        });
        return errors;
    }

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
    validateForm(formId: string, validationOptions: {}, fnOnError: any, fnSuccess: any) {
        let include = null, exclude = null, fnOnEachError = null;
        let errorsCount = 0;
        let input;
        if (validationOptions) {
            include = validationOptions['include'];
            exclude = validationOptions['exclude'];
            fnOnEachError = validationOptions['fnOnEachError'];
        }

        $('#' + formId + ' :input').map((index, elem) => {
            input = $(elem)[0];
            if (input.type === 'text' || input.tagName === 'SELECT' ||
                input.type === 'number' || input.type === 'textarea' || input.type === "file") {
                if (!exclude || (exclude && exclude.indexOf(input.id) === -1)) { //if there is excluded list and it does not exist
                    errorsCount += this.checkInput(input, include, fnOnEachError);

                }
            }

        });
        if (fnOnError && errorsCount > 0) {
            fnOnError();
        } else if (fnSuccess && errorsCount === 0) {
            fnSuccess();
        }
    }

    /**
     * Checks if element is visible or hidden
     * @param {HTMLElement} elem
     * @return {Boolean}
     */
    private static inputVisible(elem: HTMLElement): Boolean {
        if (!(elem instanceof Element)) throw Error('DOM Utility: parameter in inputVisible is not an element');
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

    }

    showErrorMessage(message) {
        this.notify('error', message);
    }

    showSuccessMessage(message, onOk?: Function) {
        this.notify('success', '<p class="pt-3">' + message + '</p>', null, onOk)
    }

    private notify(type: string, message: string, btnType?: string, onBtnClick?: Function) {
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
        let modal = $('#alertModal');
        if (onBtnClick) {
            modal.on('hidden.bs.modal', () => {
                onBtnClick();
            });
        }
        modal.modal();
    }

    /**
     * Show a native sharePoint modal dialog (cannot be closed by user) with a progress loader
     * @param message
     */
    showProgressLoader(message): SP.UI.ModalDialog {
        let elem = document.createElement('div');
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
    }

    reloadWindow() {
        //reset all form fields first
        $(':input')
            .not(':button, :submit, :reset, :hidden,[readonly]')
            .removeAttr('checked').removeAttr('selected')
            .not(':checkbox, :radio, select').val('');
        window.location.reload();
    }

}

/*** Application constants ****/

const employeeList = {
    listItemsRef: null, // reference to object to hold list items if successful
    name: 'employees'
};

const departmentList = {
    listItemsRef: null,
    name: 'departments'
};

const leaveRequestList = {
    listItemsRef: null,
    name: 'LeaveRequests' //leave requests
};

const leaveDaysAccount = {
    listItemsRef: null,
    name: 'LeaveDaysAccount'
};

const donorsList = {
    listItemsRef: null,
    name: 'Donors'
};

const travelAttachmentList = {
    listItemsRef: null,
    name: 'TravelAttachments'
};
const travelRequestList = {
    listItemsRef: null,
    name: 'TravelRequests'
};

const ticketRequestList = {
    listItemsRef: null,
    name: "TicketRequests"
};

const eventsList = {
    listItemsRef: null,
    name: 'Events'
};
const newsList = {
    listItemsRef: null,
    name: 'News'
};
const keyPeopleList = {
    listItemsRef: null,
    name: 'keyPeople'
};
const sharedDocsList = {
    listItemsRef: null,
    name: 'Documents'
};

const quickLinks = {
    listItemsRef: null,
    name: 'QuickLinks'
};

const helpDeskIssuesList = {
    listItemsRef: null,
    name: 'HelpDeskIssues'
};
const currenciesList = {
    listItemsRef: null,
    name: 'CurrencyList'
};

const cabRequestsList = {
    listItemsRef: null,
    name: 'CabRequests'
};

const donorsBudgetLines = {
    listItemsRef: null,
    name: 'BudgetLine'
};

const departmentEventsList = {
    listItemsRef: null,
    name: 'Calendar'
};

const departmentsFeaturedList = {
    listItemsRef: null,
    name: 'DepartmentsFeatured'
};

const pettyCashList = {
    listItemsRef: null,
    name: 'PettyCash'
};
const pettyCashSurrenderList = {
    listItemsRef: null,
    name: 'PettyCashSurrender'
};

const stationeryRequestList = {
    listItemsRef: null,
    name: 'StationeryRequests'
};
const stationeryIssueHistoryList = {
    listItemsRef: null,
    name: 'StationeryIssueHistory'
};
const stationeryInventoryItemsList = {
    listItemsRef: null,
    name: 'InventoryItems'
};
const salaryAdvanceRequestList = {
    listItemsRef: null,
    name: 'SalaryAdvanceRequests'
};
const payrollDataList = {
    listItemsRef: null,
    name: 'PayrollData'
};
const purchaseRequestList = {
    listItemsRef: null,
    name: 'PurchaseRequsitionRequest'
};
const UOMList = {
    listItemsRef: null,
    name: 'Unit%20of%20measure'
};
const leaveHistoryList = {
    listItemsRef: null,
    name: 'LeaveDaysTakenHistory'
};
const expenseTypesList = {
    listItemsRef: null,
    name: 'NatureList'
};
const cabInvoiceList = {
    listItemsRef: null,
    name: 'CabInvoices'
};
const condensedPurchaseRequestsList = {
    listItemsRef: null,
    name: 'CondensedPurchaseRequests'
};
const sitePagesList = {
    listItemsRef: null,
    name: 'Site Pages'
};
const helpNotesList = {
    listItemsRef: null,
    name: 'HelpNotes'
};

//Groups

const adminUserGroup = {
    name: 'Admin'
};

const financeUserGroup = {
    name: 'Finance'
};

const helpSupportUserGroup = {
    name: 'Help Desk Support'
};

const HRUserGroup = {
    name: 'Hr'
};

const supervisorsGroup = {
    name: 'Supervisors'
};

const storeKeeperGroup = {
    name: 'Store keeper'
};
const executiveDirectorGroup = {
    name: 'ED'
};
const budgetHoldersGroup = {
    name: 'Budget Holders'
};
const ProcurementUsersGroup = {
    name: 'Procurement'
};

const currencyConversionApi = 'http://www.apilayer.net/api/live' +
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