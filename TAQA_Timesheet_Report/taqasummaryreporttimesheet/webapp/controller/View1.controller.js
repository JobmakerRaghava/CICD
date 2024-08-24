sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/json/JSONModel",
    "taqasummaryreporttimesheet/util/xlsx",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/m/IllustratedMessage"
],
    function (Controller,
        BusyIndicator,
        JSONModel,
        xlsx,
        MessageBox,
        Filter,
        FilterOperator,
        Token,
        IllustratedMessage) {
        "use strict";
        var aAllowances = [
            {
                "Value": "Job Bonus",
                "Key": ""
            },
            {
                "Value": "Overtime",
                "Key": ""
            },
            {
                "Value": "Critical Bonus",
                "Key": ""
            },
            {
                "Value": "Job Bonus %",
                "Key": ""
            },
            {
                "Value": "Meal Allowance",
                "Key": ""
            },
            {
                "Value": "Travel Bonus",
                "Key": ""
            },
            {
                "Value": "Trip Bonus",
                "Key": ""
            },
            {
                "Value": "Tier 1",
                "Key": ""
            },
            {
                "Value": "Tier 2",
                "Key": ""
            },
            {
                "Value": "Tier 3",
                "Key": ""
            },
            {
                "Value": "Zero NPT bonus",
                "Key": ""
            },
            {
                "Value": "Special FTA Bonus",
                "Key": ""
            },
            {
                "Value": "Standby Bonus",
                "Key": ""
            }
        ];

        return Controller.extend("taqasummaryreporttimesheet.controller.View1", {
            onInit: async function () {
                // BusyIndicator.show()
                if (sap.ushell.Container) {
                    let user = sap.ushell.Container.getService("UserInfo").getUser();
                    // console.log(user)
                    let userEmail = user.getEmail();
                    // userEmail = 'vsreenivasulu@kaartech.com';
                    // console.log(userEmail);
                    if (userEmail !== undefined) {
                        let userD = await this.getEmpDetailsEmail(userEmail);
                        // let userD = 'yes'; //userD.admin
                        if (userD.admin === "yes") {
                            let fnValidator = function (args) {
                                let text = args.text;
                                return new Token({ key: text, text: text });
                            };
                            let oMultiInput1 = this.getView().byId("idInput");
                            oMultiInput1.addValidator(fnValidator);

                            let oModel = this.getOwnerComponent().getModel(),
                                sPath = "/RowInfo",
                                filters = new Array(),
                                filterByName,
                                filterByStartDate,
                                filterByEndDate,
                                that = this;
                            filterByName = new Filter("TableName", FilterOperator.EQ, "CutOffCycles");
                            filterByStartDate = new Filter("Column1", FilterOperator.LE, this._convert_Date2(new Date()));
                            filterByEndDate = new Filter("Column2", FilterOperator.GE, this._convert_Date2(new Date()));

                            filters.push(filterByName);
                            filters.push(filterByStartDate);
                            filters.push(filterByEndDate);
                            // that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
                            // that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));

                            await oModel.read(sPath, {
                                filters: filters,
                                success: async function (odata) {
                                    // that.getView().byId("StartDate").setValue(odata.results[0].Column1);
                                    // that.getView().byId("EndDate").setValue(odata.results[0].Column2);
                                    that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
                                    that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));
                                    // var oFilters = [];
                                    // oFilters.push(new sap.ui.model.Filter("Date", sap.ui.model.FilterOperator.BT, odata.results[0].Column1, odata.results[0].Column2));
                                    that.onSearch();
                                    // that._onSummaryPress(oFilters);
                                    // BusyIndicator.hide()

                                },
                                error: function (error) {
                                    MessageBox.error(error);
                                }
                            });
                        } else {
                            let oPage = this.getView().byId("page");
                            oPage.removeAllContent();
                            let oIllustratedMessage = new IllustratedMessage({
                                illustrationType: "sapIllus-ErrorScreen",
                                title: "Access Denied",
                                description: "You need permission to access this page. Request access from your administrator."
                            });

                            oPage.addContent(oIllustratedMessage);
                        }
                    }
                    else {
                        let oPage = this.getView().byId("page");
                        oPage.removeAllContent();
                        let oIllustratedMessage = new IllustratedMessage({
                            illustrationType: "sapIllus-ErrorScreen",
                            title: "Undefined"
                        });

                        oPage.addContent(oIllustratedMessage);
                    }
                }

            },
            handleSelectionChange: function (oEvent) {
                //var selectedItems = oEvent.getSource().getSelectedKeys()

            },
            handleSelectionFinish: function (oEvent) {
                this._onSummaryReport();

                // let Filters = oEvent.getSource().getSelectedKeys();
                // let oFilterdata = this.getView().getModel("oFilterModel").getData().rows;
                // let oFiltered = [];
                // //var oFilter= [];
                // let tab = this.getView().byId("SummaryTable");
                // if (Filters.length == 0) {
                //     tab.getModel().getData().rows = oFilterdata;
                // } else {
                //     oFilterdata.map(function (items, index) {
                //         let oValues = Object.values(items);
                //         const intersection = oValues.filter(element => Filters.includes(element));
                //         if (intersection.length == 1) {
                //             oFiltered.push(items);
                //         }
                //     });
                //     tab.getModel().getData().rows = oFiltered;

                // }
                // tab.getModel().refresh(true);
            },
            _convert_Date2: function (value) {
                let date = new Date(value);

                // Get the year, month, and day
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);

                // Form the ISO date format string
                let isoDateString = year + "-" + month + "-" + day;
                // let isoDateString = day + "-" + month + "-" + year;
                return isoDateString;
            },
            _convert_Date: function (value) {
                let date = new Date(value);

                // Get the year, month, and day
                let year = date.getFullYear();
                let month = ("0" + (date.getMonth() + 1)).slice(-2);
                let day = ("0" + date.getDate()).slice(-2);

                // Form the ISO date format string
                // let isoDateString = year + "-" + month + "-" + day;
                let isoDateString = day + "-" + month + "-" + year;
                return isoDateString;
            },
            onDateObject: function (value) {

                return new Date(value);
            },
            onFormateDate: function (value) {

                var dateObject = new Date(value);

                // Extract the day, month, and year
                var day = String(dateObject.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
                var month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1) and pad with leading zero
                var year = dateObject.getFullYear(); // Get the full year

                // Format as DD-MM-YYYY
                return `${day}-${month}-${year}`;
            },

            _onSummaryPress: function (oFilters) {

                BusyIndicator.show();
                let oHeaderModel = new JSONModel();
                let oAllowancesModel = new JSONModel();
                oAllowancesModel.setData(aAllowances);
                this.getView().setModel(oAllowancesModel, "oAllowancesModel");
                let oSummaryModel = new JSONModel();

                // let StartDate_time = this.getView().byId("StartDate").getProperty("value");
                // let EndDate_time = this.getView().byId("EndDate").getProperty("value");

                // let StartDate_time = this.getView().byId("idDatePicker").getFrom();
                // let EndDate_time = this.getView().byId("idDatePicker").getTo();

                // debugger;
                // var StartDate_time = this.getView().byId("StartDate").getValue();
                // var EndDate_time = this.getView().byId("EndDate").getValue();
                // let StartDateObject = new Date(StartDate_time);
                // let EndDateObject = new Date(EndDate_time);



                // let oStart = this._convert_Date(StartDateObject);
                // let oEnd = this._convert_Date(EndDateObject);



                var that = this;
                // var oFilters = [];
                var oModelDetail = this.getOwnerComponent().getModel();

                oFilters.push(new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, 'Approved'));
                oModelDetail.read("/TimeSheetDetails", {
                    filters: [oFilters],
                    urlParameters: {
                        "$expand": "ItsAllowances"


                    },
                    success: function (oData, oResponse) {
                        BusyIndicator.hide();
                        if (oData.results.length === 0) {
                            MessageBox.information("We couldn't find data for the given dates");
                            that.getView().getModel("AdminStatusList").setData({});
                            that.getView().byId("SummaryTable").unbindRows()

                        } else {
                            oSummaryModel.setData(oData);
                            that.getView().setModel(oSummaryModel, "oHeaderModel");
                            that._onSummaryReport();
                            that._onDetailedReport(oData, oHeaderModel);
                        }

                    },
                    error: function (oError) {
                        BusyIndicator.hide();
                        MessageBox.error(oError);

                    },
                    // async: false
                });
            },

            _onSummaryReport: function () {
                let that = this;
                let AdminStatusList = this.getView().getModel("oHeaderModel").getData();
                let dummyData = JSON.parse(JSON.stringify(AdminStatusList));
                let rowData = [];
                let oSelectedkeys = this.getView().byId("idMultiComboBox").getSelectedKeys();
                if (oSelectedkeys.length !== 0) {
                    dummyData.results = dummyData.results.map(function (item) {
                        if (Array.isArray(item.ItsAllowances.results)) {
                            item.ItsAllowances.results = item.ItsAllowances.results.filter(function (allowance) {
                                return oSelectedkeys.includes(allowance.AllowanceDesc);
                            });
                        } else {
                            console.warn("ItsAllowances is not an array or is missing for item:", item);
                        }
                        return item;
                    });
                    debugger;
                }


                dummyData.results.map(function (oColumns) {
                    // let StartDate_time = that.getView().byId("StartDate").getProperty("value");
                    // let EndDate_time = that.getView().byId("EndDate").getProperty("value");
                    let StartDate_time = that.getView().byId("idDatePicker").getFrom();
                    let EndDate_time = that.getView().byId("idDatePicker").getTo();
                    let StartDateObject = new Date(StartDate_time);
                    let EndDateObject = new Date(EndDate_time).getTime();
                    if (oColumns.Date != "") {
                        // const foundEmpId = rowData.some(e1 => (e1.EmployeeID == oColumns.EmployeeID));
                        //if(!foundEmpId) rowData.push(objj);
                        let oInnerAllowances = oColumns.ItsAllowances.results;

                        if (oInnerAllowances != "") {
                            let objj = {
                                // "Index": index,
                                "Employee ID": oColumns.EmployeeID,
                                "Employee Name": oColumns.EmployeeName,
                                // "Location": oColumns.Location,
                                "Location": oColumns.LocationDesc,
                                // "Department": oColumns.Department,
                                "Department": oColumns.DepartmentDesc,
                                // "Division": oColumns.Division,
                                "Division": oColumns.DivisionDesc,
                                "Project Code": `${oColumns.WbsCode} ${oColumns.CostCenter} ${oColumns.InternalOrder}`,
                                "Job Title": oColumns.JobTitle,
                                "Project Desc": oColumns.ProjectDesc
                            };

                            let oAllAllowance = {};
                            oInnerAllowances.map(function (itAllowances) {
                                // let objj = {
                                //     // "Index": index,
                                //     "Employee ID": oColumns.EmployeeID,
                                //     "Employee Name": oColumns.EmployeeName,
                                //     // "Location": oColumns.Location,
                                //     "Location": oColumns.LocationDesc,
                                //     // "Department": oColumns.Department,
                                //     "Department": oColumns.DepartmentDesc,
                                //     // "Division": oColumns.Division,
                                //     "Division": oColumns.DivisionDesc,
                                //     "Project Code": `${oColumns.WbsCode} ${oColumns.CostCenter} ${oColumns.InternalOrder}`,
                                //     "Job Title": oColumns.JobTitle,
                                //     "Project Desc":oColumns.ProjectDesc
                                // };

                                if (itAllowances.HistoryRecord === '') {//for active records 


                                    for (let d = StartDateObject; d <= EndDateObject; d.setDate(d.getDate() + 1)) {
                                        // var oDatee = d.toLocaleDateString().split("/").reverse().join("-");
                                        let oDatee = that._convert_Date(d);
                                        // objj[oDatee] = "";
                                        oAllAllowance[oDatee] = "";
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Overtime") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] += itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';


                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Job Bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Trip Bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Zero NPT bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Critical Bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Job Bonus %") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Meal Allowance") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';

                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Tier 2") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] += itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';

                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Tier 1") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Tier 3") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Travel Bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Special FTA Bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Standby Bonus") {
                                        let odate = that._convert_Date(itAllowances.Date);
                                        // objj[odate] = itAllowances.AllowanceDesc
                                        oAllAllowance[odate] += itAllowances.AllowanceDesc + '\n';
                                    }
                                    // rowData.push(objj);
                                }
                            });

                            Object.assign(objj, oAllAllowance);
                            rowData.push(objj);
                        }
                    }
                });
                rowData.sort(function (a, b) {
                    return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);
                });
                let columnData = [
                    {
                        columnName: "Employee ID"
                    },
                    {
                        columnName: "Employee Name"
                    },
                    {
                        columnName: "Job Title"
                    },
                    {
                        columnName: "Location"
                    },
                    // {
                    //     columnName: "LocationDescription"
                    // },
                    {
                        columnName: "Department"
                    },
                    // {
                    //     columnName: "DepartmentDescription"
                    // },
                    {
                        columnName: "Division"
                    },
                    // {
                    //     columnName: "DivisionDescription"
                    // },
                    {
                        columnName: "Project Code"
                    },
                    {
                        columnName: "Project Desc"
                    }
                ];
                // let StartDate_time = this.getView().byId("StartDate").getProperty("value");
                // let EndDate_time = this.getView().byId("EndDate").getProperty("value");
                let StartDate_time = this.getView().byId("idDatePicker").getFrom();
                let EndDate_time = this.getView().byId("idDatePicker").getTo();

                let StartDateObject = new Date(StartDate_time);
                let EndDateObject = new Date(EndDate_time).getTime();
                // var StartDate = this.getView().byId("StartDate").getProperty("dateValue");
                // var EndDate = this.getView().byId("EndDate").getProperty("dateValue");
                // var start = StartDateObject;
                // var endTime = EndDateObject.toString();
                // endTime = endTime.getTime();
                for (let start_Date = StartDateObject; start_Date <= EndDateObject; start_Date.setDate(start_Date.getDate() + 1)) {
                    //columnData.columnName = omonthStart;
                    let oMonth = {
                        // "columnName": start_Date.toISOString().substring(0, 10)
                        // "columnName": start_Date.toLocaleDateString().split("/").reverse().join("-")
                        "columnName": that._convert_Date(start_Date)
                    }
                    columnData.push(oMonth);
                }
                let oModelTable = new sap.ui.model.json.JSONModel();

                oModelTable.setData({
                    columns: columnData,
                    rows: rowData,
                });
                let oFilterModel = new JSONModel();
                oFilterModel.setData({
                    columns: columnData,
                    rows: rowData,
                });

                this.getView().setModel(oFilterModel, "oFilterModel");
                let oTable = this.getView().byId("SummaryTable");
                oTable.setModel(oModelTable);
                this.getView().setModel(oModelTable, "oSummaryModel");
                oTable.bindColumns("/columns", function (sId, oContext) {
                    //var sColumnId = oContext.getObject().columnName;
                    let columnName = oContext.getObject().columnName;
                    let oTemplate = new sap.m.Text({
                        text: `{${columnName}}`,
                        class: "multilines"
                    });
                    // oTemplate.addStyleClass("multilines");
                    return new sap.ui.table.Column({
                        label: columnName,
                        width: "8em",
                        template: oTemplate,
                        sortProperty: columnName,

                    });
                });
                oTable.bindRows("/rows");

            },
            _onDetailedReport: function (oData, oHeaderModel) {
                let oResults = oData.results;
                let OHeaderResults = [];
                let that = this;
                oResults.map(function (item) {
                    let oHeader = {
                        "EmployeeID": "",
                        "EmployeeName": "",
                        "Date": "",
                        "ProjectCode": "",
                        "WorkType": "",
                        "TotalHours": "",
                        "OvertimeHours": "",
                        "JobBonus": "",
                        "CriticalBonus": "",
                        "JobBonusPer": "",
                        "MealAllowance": "",
                        "TravelBonus": "",
                        "TripBonus": "",
                        "Tier1Bonus": "",
                        "Tier2Bonus": "",
                        "Tier3Bonus": "",
                        "ZERONPTBonus": "",
                        "FTABonus": "",
                        "LeaveAccrual": "",
                        "CostCenter": "",
                        "InternalOrder": "",
                        "StandbyBonus": "",
                        "ProjectDesc": ""
                    };
                    oHeader.EmployeeID = item.EmployeeID;
                    oHeader.EmployeeName = item.EmployeeName;
                    // oHeader.Date = that._convert_Date(item.Date);
                    oHeader.Date = that.onDateObject(item.Date);
                    oHeader.ProjectCode = item.WbsCode;
                    oHeader.WorkType = item.WorkType;
                    oHeader.TotalHours = item.TotalHours;
                    oHeader.OvertimeHours = item.OvertimeHours;
                    oHeader.InternalOrder = item.InternalOrder;
                    oHeader.CostCenter = item.CostCenter;
                    oHeader.ProjectDesc = item.ProjectDesc;
                    if (item.RotationalLeaveBalance !== 'NaN') {
                        oHeader.LeaveAccrual = item.RotationalLeaveBalance;
                    }
                    let oInnerAllowances = item.ItsAllowances.results;
                    oInnerAllowances.map(function (itAllowances) {
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '9050') {//"Job Bonus"
                            oHeader['JobBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === "9080") { //Trip Bonus
                            oHeader['TripBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === "9265") { //ZERO NPT Bonus
                            oHeader['ZERONPTBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "9070") { //Critical Bonus "9070"
                            oHeader['CriticalBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === "9100") { //Meal Allowance
                            oHeader['MealAllowance'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === "9040") { //Job Bonus % "9040"1179
                            oHeader['JobBonusPer'] = itAllowances.Number
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '9225') { //Tier1
                            oHeader['Tier1Bonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '9235') { //Tier2
                            oHeader['Tier2Bonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '9245') { //Tier3
                            oHeader['Tier3Bonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Travel Bonus") { //TravelBonus 9090   itAllowances.AllowanceID === '1183'
                            oHeader['TravelBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceID === '9080') { //TripBonus 9080 1182
                            oHeader['TripBonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Special FTA Bonus") { //FTABonus  itAllowances.AllowanceID === '9246'
                            oHeader['FTABonus'] = itAllowances.Amount
                        }
                        if (itAllowances.Amount != undefined && itAllowances.AllowanceDesc === "Standby Bonus") {
                            oHeader['StandbyBonus'] = itAllowances.Amount
                        }

                    });
                    OHeaderResults.push(oHeader);
                });
                OHeaderResults.sort(function (a, b) {
                    // return parseFloat(a.EmployeeID) - parseFloat(b.EmployeeID);

                    const employeeIdComparison = a.EmployeeID.localeCompare(b.EmployeeID);
                    if (employeeIdComparison !== 0) {
                        return employeeIdComparison;
                    }
                    // return a.Date.localeCompare(b.Date);
                    const dateA = new Date(a.Date).getTime();
                    const dateB = new Date(b.Date).getTime();
                    return dateA - dateB;

                });
                oHeaderModel.setData(OHeaderResults);
                this.getView().setModel(oHeaderModel, "AdminStatusList");
            },
            // onGetData: function () {
            //     var StartDate = this.getView().byId("StartDate").getProperty("dateValue");
            //     var EndDate = this.getView().byId("EndDate").getProperty("dateValue");


            //     const obj = StartDate;

            //     //let obj = new Date(); 
            //     let day = obj.getDate();
            //     let month = obj.getMonth() + 1;
            //     let year = obj.getFullYear();
            //     console.log(`Day: ${day}, Month: ${month}, Year: ${year}`);

            //     const newDate = year + "/" + month + "/" + day;
            //     alert(newDate);
            // },
            onExportPress: function () {
                let that = this;
                const binding = this.byId("table").getBinding("rows");
                let MyDataModel = this.getView().getModel("oSummaryModel");
                //var myResultArray = MyDataModel.getProperty("/results");
                let oColumns = MyDataModel.getData().rows;
                let oSummaryResults = [];
                for (let iSummary = 0; iSummary <= oColumns.length - 1; iSummary++) {
                    let oColumname = oColumns[iSummary].columnName;
                    let oSummaryColumn = {};
                    oSummaryColumn[oColumname] = "";
                    //oSummaryColumn[iSummary].columnName = ""
                    oSummaryResults.push(oSummaryColumn);
                }
                let worksheet = XLSX.utils.json_to_sheet(oColumns);

                let oResults = [];
                let MyDataModel1 = this.getView().byId("table").getBinding("rows").getModel("AdminStatusList").getProperty(binding.getPath());
                debugger;
                for (let i = 0; i <= MyDataModel1.length - 1; i++) {
                    let object1 = {
                        "Employee ID": MyDataModel1[i].EmployeeID,
                        "Employee Name": MyDataModel1[i].EmployeeName,
                        "Date": that._convert_Date(MyDataModel1[i].Date),
                        "Project Code": `${MyDataModel1[i].WbsCode} ${MyDataModel1[i].CostCenter} ${MyDataModel1[i].InternalOrder}`,
                        "Working Type": MyDataModel1[i].WorkType,
                        "Total Hours": MyDataModel1[i].TotalHours,
                        "Overtime": MyDataModel1[i].OvertimeHours,
                        "Job Bonus": MyDataModel1[i].JobBonus,
                        "Critical Bonus": MyDataModel1[i].CriticalBonus,
                        "Job Bonus %": MyDataModel1[i].JobBonusPer,
                        "Meal Allowance": MyDataModel1[i].MealAllowance,
                        "Travel Bonus": MyDataModel1[i].TravelBonus,
                        "Trip Bonus": MyDataModel1[i].TripBonus,
                        "Tier1": MyDataModel1[i].Tier1Bonus,
                        "Tier2": MyDataModel1[i].Tier2Bonus,
                        "Tier3": MyDataModel1[i].Tier3Bonus,
                        "ZERO NPT Bonus": MyDataModel1[i].ZERONPTBonus,
                        "FTA Bonus": MyDataModel1[i].FTABonus,
                        "Leave Accrual": MyDataModel1[i].LeaveAccrual,
                        "Standby Bonus": MyDataModel1[i].StandbyBonus,
                        "Project Desc": MyDataModel1[i].ProjectDesc
                    };
                    oResults.push(object1);
                }

                let worksheet1 = XLSX.utils.json_to_sheet(oResults);

                let workBook = XLSX.utils.book_new();
                // var workBook1 = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(workBook, worksheet, "Summary Report");
                XLSX.utils.book_append_sheet(workBook, worksheet1, "Detailed Report");
                let sFilename = "Timesheet Report.xlsx";
                XLSX.writeFile(workBook, sFilename);
            },
            onSearch: function () {
                let oDateRang = this.getView().byId("idDatePicker").getDateValue();
                if (oDateRang !== null) {
                    let oFilterBar = this.getView().byId("filterbar"),
                        that = this,
                        aFilters = [],
                        oModel = this.getOwnerComponent().getModel(),
                        oBusydailog = new sap.m.BusyDialog(),
                        aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                            let oControl = oFilterGroupItem.getControl();
                            if (oControl instanceof sap.m.Input) {
                                let sInputValue = oControl.getValue();
                                if (sInputValue) {
                                    aFilters.push(new Filter({
                                        path: oFilterGroupItem.getName(),
                                        operator: FilterOperator.Contains,
                                        value1: sInputValue,
                                        caseSensitive: false
                                    }));
                                }
                            }
                            if (oControl instanceof sap.m.DateRangeSelection) {
                                let sInputValue = oControl.getValue();
                                let vS = that._convert_Date2(oControl.getFrom());
                                let vE = that._convert_Date2(oControl.getTo());
                                if (sInputValue) {
                                    aFilters.push(new Filter({
                                        path: oFilterGroupItem.getName(),
                                        operator: FilterOperator.BT,
                                        value1: vS,
                                        value2: vE
                                    }));
                                }
                            }
                            if (oControl instanceof sap.m.MultiInput) {
                                let aTokens = oControl.getTokens();
                                if (aTokens.length > 0) {
                                    aTokens.forEach(function (oToken) {
                                        let sTokenValue = oToken.getText();
                                        if (sTokenValue) {
                                            aFilters.push(new Filter({
                                                path: oFilterGroupItem.getName(),
                                                operator: FilterOperator.EQ,
                                                value1: sTokenValue,
                                                and: true
                                            }));
                                        }
                                    });
                                }
                            }
                            return aFilters;
                        }, []);
                    this._onSummaryPress(aTableFilters)
                } else {
                    MessageBox.error("Date is Mandatory")
                }

            },
            onFilterBarClear: function () {
                this.getView().byId("idInputDepartment").setValue("");
                // this.getView().byId("idInputDivision").setValue("");
                // this.getView().byId("idInputLocation").setValue("");
                // this.getView().byId("idInputLegal").setValue("");
                // this.getView().byId("idInputJob").setValue("");
                // this.getView().byId("idInputEmployeeName").setValue("");
                this.getView().byId("idInput").setTokens([]);
                this.getView().byId("idDatePicker").setValue("");
            },
            getEmpDetailsEmail: function (userEmail) {
                return new Promise((resolve, reject) => {
                    let oDataModelSF = this.getOwnerComponent().getModel("v2");
                    let that = this;
                    let oFilter1 = new Filter("userNav/email", sap.ui.model.FilterOperator.EQ, userEmail);  //"22647"  39321
                    let oBusydailog = new sap.m.BusyDialog();
                    oBusydailog.open();
                    oDataModelSF.read("/EmpJob", {
                        filters: [oFilter1],
                        urlParameters: {
                            $expand: "userNav"
                        },
                        success: (response1) => {
                            // this.getView().getModel("EmpJob").setData(response1.results[0]);
                            if (response1.results.length !== 0) {

                                that.getView().byId("idInputDepartment").setValue(response1.results[0].department);

                                let tempID = Number(response1.results[0].userId);
                                let oFilter4 = new Filter("person", sap.ui.model.FilterOperator.EQ, tempID);
                                let oFilter5 = new Filter("externalCode", sap.ui.model.FilterOperator.EQ, "Z001");
                                oDataModelSF.read("/FODynamicRole", {
                                    filters: [oFilter4, oFilter5],

                                    success: (response2) => {

                                        if (response2.results.length === 0) {
                                            resolve({
                                                "admin": "no",
                                                "userId": response1.results[0].userId
                                            });
                                        } else {
                                            resolve({
                                                "admin": "yes",
                                                "userId": response1.results[0].userId
                                            });
                                        }
                                        oBusydailog.close();

                                    },
                                    error: (error) => {
                                        reject(error);
                                        oBusydailog.close();
                                    }
                                });
                                console.log("email :", response1);
                            }
                            oBusydailog.close()
                        },
                        error: (error) => {
                            reject(error);
                            oBusydailog.close();
                        }
                    });
                });
            },
        });
    });
