sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/export/Spreadsheet',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/m/MessageBox",
    "sap/m/IllustratedMessage"
], function (Controller,
    JSONModel,
    Spreadsheet,
    Filter,
    FilterOperator,
    Token,
    MessageBox,
    IllustratedMessage) {
    "use strict";
    return Controller.extend("taqa.taqatimesheetmonthreport.controller.View1", {

        onInit: async function () {
            if (sap.ushell.Container) {
                let user = sap.ushell.Container.getService("UserInfo").getUser();
                // console.log(user)
                let userEmail = user.getEmail();
                // userEmail = 'vsreenivasulu@kaartech.com';
                console.log(userEmail);
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
                            that = this,
                            oBusydailog = new sap.m.BusyDialog();
                        oBusydailog.open();
                        filterByName = new Filter("TableName", FilterOperator.EQ, "CutOffCycles");
                        filterByStartDate = new Filter("Column1", FilterOperator.LE, this._convert_Date(new Date()));
                        filterByEndDate = new Filter("Column2", FilterOperator.GE, this._convert_Date(new Date()));
                        filters.push(filterByName);
                        filters.push(filterByStartDate);
                        filters.push(filterByEndDate);
                        oModel.read(sPath, {
                            filters: filters,
                            success: function (odata) {
                                that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
                                that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));
                                that.onSearch();
                                oBusydailog.close();
                            },
                            error: function (error) {
                                oBusydailog.close();
                                MessageBox.error(error);
                            }

                        });
                    } else {
                        let oPage = this.getView().byId("idPage");
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
                    let oPage = this.getView().byId("idPage");
                    oPage.removeAllContent();
                    let oIllustratedMessage = new IllustratedMessage({
                        illustrationType: "sapIllus-ErrorScreen",
                        title: "Undefined"
                    });

                    oPage.addContent(oIllustratedMessage);
                }
            }
        },

        // onInit: async function () {

        //     // if (sap.ushell.Container) {
        //         console.log("Inside shell");
        //         try {
        //             // Fetch user info
        //             // let user = sap.ushell.Container.getService("UserInfo").getUser();
        //             // let userEmail = user.getEmail();
        //             let userEmail = "vsreenivasulu@kaartech.com";

        //             let userD = await this.getEmpDetailsEmail(userEmail);

        //             if (userD.admin === "yes") {
        //                 let fnValidator = function (args) {
        //                     let text = args.text;
        //                     return new Token({ key: text, text: text });
        //                 };
        //                 let oMultiInput1 = this.getView().byId("idInput");
        //                 oMultiInput1.addValidator(fnValidator);
        //                 let oModel = this.getOwnerComponent().getModel(),
        //                     sPath = "/RowInfo",
        //                     filters = [],
        //                     filterByName,
        //                     filterByStartDate,
        //                     filterByEndDate,
        //                     that = this,
        //                     oBusydailog = new sap.m.BusyDialog();

        //                 oBusydailog.open();
        //                 filterByName = new Filter("TableName", FilterOperator.EQ, "CutOffCycles");
        //                 filterByStartDate = new Filter("Column1", FilterOperator.LE, this._convert_Date(new Date()));
        //                 filterByEndDate = new Filter("Column2", FilterOperator.GE, this._convert_Date(new Date()));
        //                 filters.push(filterByName, filterByStartDate, filterByEndDate);

        //                 oModel.read(sPath, {
        //                     filters: filters,
        //                     success: function (odata) {
        //                         that.getView().byId("idDatePicker").setDateValue(new Date(odata.results[0].Column1));
        //                         that.getView().byId("idDatePicker").setSecondDateValue(new Date(odata.results[0].Column2));
        //                         that.onSearch();
        //                         oBusydailog.close();
        //                     },
        //                     error: function (error) {
        //                         oBusydailog.close();
        //                         MessageBox.error(error);
        //                     }
        //                 });
        //             } else {
        //                 // console.log("No");
        //                 this.displayAccessDenied();
        //             }

        //         } catch (e) {
        //             // Handle any errors
        //             // console.error("Error fetching user info:", e);
        //             this.displayAccessDenied();
        //         }
        //     // }
        //     // else {
        //     //     // console.log("Not entering fn");
        //     //     this.displayAccessDenied();
        //     // }
        // },



        displayAccessDenied: function () {
            let oPage = this.getView().byId("idPage");
            oPage.removeAllContent();
            let oIllustratedMessage = new IllustratedMessage({
                illustrationType: "sapIllus-ErrorScreen",
                title: "Access Denied",
                description: "You need permission to access this page. Request access from your administrator."
            });
            oPage.addContent(oIllustratedMessage);
        },




        // onAllowanceChange: function (oEvent) {
        //     let oMultiComboBox = oEvent.getSource();
        //     let aAllItems = oMultiComboBox.getItems();
        //     let aSelectedItems = oMultiComboBox.getSelectedItems();
        //     let oSelectAllItem = oMultiComboBox.getItems().find(item => item.getKey() === "SelectAll");

        //     // Check if "Select All" is selected
        //     let bSelectAllSelected = aSelectedItems.some(item => item.getKey() === "SelectAll");

        //     if (bSelectAllSelected) {
        //         // "Select All" is selected, so select all other items
        //         aAllItems.forEach(item => {
        //             if (item.getKey() !== "SelectAll" && !oMultiComboBox.isItemSelected(item)) {
        //                 oMultiComboBox.addSelectedItem(item);
        //             }
        //             // Ensure all items, including selected ones, are visible
        //             if (this.getView().byId(item.getKey())) {
        //                 this.getView().byId(item.getKey()).setVisible(true);
        //             }
        //         });
        //     } else {
        //         // Handle individual item selections and deselections
        //         // Ensure "Select All" is not in the selection if deselected
        //         if (oSelectAllItem && oMultiComboBox.isItemSelected(oSelectAllItem)) {
        //             oMultiComboBox.removeSelectedItem(oSelectAllItem);
        //         }

        //         // Handle visibility based on individual selections
        //         aAllItems.forEach(item => {
        //             let itemId = item.getKey();
        //             let bIsSelected = oMultiComboBox.getSelectedItems().some(selectedItem => selectedItem.getKey() === itemId);

        //             // Update visibility based on current selection
        //             if (this.getView().byId(itemId)) {
        //                 this.getView().byId(itemId).setVisible(bIsSelected);
        //             }
        //         });
        //     }

        //     // Ensure visibility for "Select All" itself
        //     if (oSelectAllItem && this.getView().byId(oSelectAllItem.getKey())) {
        //         this.getView().byId(oSelectAllItem.getKey()).setVisible(true);
        //     }
        // },



        onAllowanceChange: function (oEvent) {
            const oSelectedItems = oEvent.getSource().getSelectedItems();
            const oUnselectedItems = oEvent.getSource()._getUnselectedItems();

            // Handle Selected Items
            oSelectedItems.forEach(item => {
                let sId = item.getKey();
                // Skip if the key is 'SelectAll' or the element does not exist
                if (sId !== "SelectAll" && this.getView().byId(sId)) {
                    this.getView().byId(sId).setVisible(true);
                }
            });

            // Handle Unselected Items
            oUnselectedItems.forEach(item => {
                let sId = item.getKey();
                // Skip if the key is 'SelectAll' or the element does not exist
                if (sId !== "SelectAll" && this.getView().byId(sId)) {
                    this.getView().byId(sId).setVisible(false);
                }
            });
        },


        onExcelButtonPress: function (oEvent) {
            let oRowBinding = this.getView().byId("employeeTable").getBinding().getModel().getProperty('/'),
                oColumns = this.getView().byId("employeeTable")._getVisibleColumns(),
                ColumnsLabels = [];
            oColumns.forEach(function (column) {
                ColumnsLabels.push({
                    property: column.getTemplate().getBindingPath("text"),
                    label: column.getLabel().getText()
                });
            });
            if (oRowBinding.length !== 0) {

                let oSettings = {
                    workbook: {
                        columns: ColumnsLabels,
                        context: {
                            sheetName: 'Timesheet'
                        }
                    },
                    dataSource: oRowBinding,
                    fileName: 'Timesheet Report.xlsx',
                    worker: false
                };
                let oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            } else {
                MessageBox.warning("No Data Found for download")
            }
        },

        // onExcelButtonPress: function () {
        //     let that = this,
        //         oTable = this.getView().byId("employeeTable"),
        //         oItems = oTable.getItems(),
        //         aData = [],
        //         aColumns = oTable.getColumns(),
        //         ColumnsLabels = [];
        //     aColumns.forEach(function (column) {
        //         let oHeader = column.getHeader();
        //         ColumnsLabels.push({
        //             property: column.getId(),
        //             label: oHeader ? oHeader.getText() : ""
        //         });
        //     });
        //     oItems.forEach(function (item) {
        //         let aCells = item.getCells(),
        //             oRow = {};
        //         aCells.forEach(function (cell, index) {
        //             let property = ColumnsLabels[index].property;
        //             if (property) {
        //                 oRow[property] = cell.getText();
        //             }
        //         });
        //         aData.push(oRow);
        //     });
        //     if (aData.length !== 0) {
        //         let oSettings = {
        //             workbook: {
        //                 columns: ColumnsLabels,
        //                 context: {
        //                     sheetName: 'Timesheet'
        //                 }
        //             },
        //             dataSource: aData,
        //             fileName: 'Month Wise Report.xlsx',
        //             worker: false
        //         };
        //         let oSheet = new Spreadsheet(oSettings);
        //         oSheet.build().finally(function () {
        //             oSheet.destroy();
        //         });
        //     } else {
        //         MessageBox.warning("No Data Found for download");
        //     }
        // },
        onCalculateData: function (oAllRecords) {
            const oJsonData = oAllRecords;
            oJsonData.sort((a, b) => a.EmployeeID.localeCompare(b.EmployeeID));

            const processedData = {};
            oJsonData.forEach(record => {
                const employeeID = record["EmployeeID"];
                if (!processedData[employeeID]) {
                    processedData[employeeID] = {
                        "EmployeeID": employeeID,
                        "EmployeeName": record["EmployeeName"],
                        "JobTitle": record["JobTitle"],
                        "LegalEntity": record["CompanyCode"],
                        "LegalEntityDescription": record["CompanyCodeDesc"],
                        "Location": record["Location"],
                        "Division": record["Division"],
                        "DivisionDesc": record["DivisionDesc"],
                        "Department": record["Department"],
                        "DepartmentDesc": record["DepartmentDesc"],
                        "LocationDesc": record["LocationDesc"],
                        "WorkedDays": 0,
                        "UnpaidDays": 0,
                        "AnnualLeave": 0,
                        "RotationLeave": 0,
                        "SickLeave": 0,
                        "OtherLeaves": 0,
                        "JobBonusDays": 0,
                        "JobBonusAmount": 0,
                        "MealAllowances": 0,
                        "MealAllowancesAmount": 0,
                        "Tier1": 0,
                        "Tier1Amount": 0,
                        "Tier2": 0,
                        "Tier2Amount": 0,
                        "Tier3": 0,
                        "Tier3Amount": 0,
                        "LeaveAccrual": 0,
                        "OvertimeHours": 0
                    };
                }
                // Existing logic to update counts
                if (record["WorkType"] !== "") {
                    processedData[employeeID]["WorkedDays"] += 1;
                }
                if (record["LeaveCode"] === "SA_AUTU5" || record["Absence"] === "SA_AUTU15" || record["Absence"] === "SA_AUTUM15" || record["Absence"] === "SA_UNAUTH") {
                    processedData[employeeID]["UnpaidDays"] += 1;
                }
                if (record["LeaveCode"] === "SA_ANNL10D") { // annual leave
                    processedData[employeeID]["AnnualLeave"] += 1;
                }
                if (record["LeaveCode"] === "RL_KSA") { // rotational leave
                    processedData[employeeID]["RotationLeave"] += 1;
                }
                if (record["LeaveCode"] === "SA_SICK30" || record["LeaveCode"] === "SA_SICKGE5") { // sick leave
                    processedData[employeeID]["SickLeave"] += 1;
                }
                if (record["LeaveCode"] === "SA_PAT" ||
                    record["LeaveCode"] === "SA_HAJJ" ||
                    record["LeaveCode"] === "SA_MARR" ||
                    record["LeaveCode"] === "SA_GOAU" ||
                    record["LeaveCode"] === "SA_ATCUSO" ||
                    record["LeaveCode"] === "SA_MAT" ||
                    record["LeaveCode"] === "SA_EDDAH" ||
                    record["LeaveCode"] === "SA_EMER" ||
                    record["LeaveCode"] === "SA_EXAM" ||
                    record["LeaveCode"] === "SA_MED_DIS" ||
                    record["LeaveCode"] === "SA_CHILD") { // other leaves
                    processedData[employeeID]["OtherLeaves"] += 1;
                }
                if (record["ItsAllowances"].results.length !== 0) {
                    record["ItsAllowances"].results.forEach(Allowances => {
                        if (Allowances.AllowanceID === '9050') { // job bonus
                            processedData[employeeID]["JobBonusDays"] += 1;
                            processedData[employeeID]["JobBonusAmount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9100') { //meal allowance
                            processedData[employeeID]["MealAllowances"] += 1;
                            processedData[employeeID]["MealAllowancesAmount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9225') { //Tier1
                            processedData[employeeID]["Tier1"] += 1;
                            processedData[employeeID]["Tier1Amount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9235') { //Tier2
                            processedData[employeeID]["Tier2"] += 1;
                            processedData[employeeID]["Tier2Amount"] += Number(Allowances.Amount);
                        }
                        if (Allowances.AllowanceID === '9245') { //Tier3
                            processedData[employeeID]["Tier3"] += 1;
                            processedData[employeeID]["Tier3Amount"] += Number(Allowances.Amount);
                        }
                    });
                }
                if (record["RotationalLeaveBalance"] !== '') {
                    processedData[employeeID]["LeaveAccrual"] += Number((record["RotationalLeaveBalance"]));
                }
                if (record["OvertimeHours"] !== '') {
                    processedData[employeeID]["OvertimeHours"] += Number(record["OvertimeHours"]);
                }
            });
            const finalData = Object.values(processedData);
            finalData.forEach(element => { element.LeaveAccrual = parseFloat(element.LeaveAccrual).toFixed(2); });
            const oModel = new JSONModel(finalData);
            const oTableTitle = this.getView().byId("idTitle");

            this.getView().setModel(oModel);
            // console.log("Model Data:", oModel.getData());
            oTableTitle.setText(`Timesheet(${finalData.length})`);
        },







        onSearch: function () {
            const oDateRang = this.getView().byId("idDatePicker").getDateValue();

            if (oDateRang !== null) {
                const oFilterBar = this.getView().byId("filterbar");
                const aFilters = [];
                const oModel = this.getOwnerComponent().getModel();
                const oBusydailog = new sap.m.BusyDialog();
                oBusydailog.open();

                aFilters.push(new Filter({
                    path: "Status",
                    operator: FilterOperator.EQ,
                    value1: "Approved"
                }));
                const aTableFilters = oFilterBar.getFilterGroupItems().reduce((aResult, oFilterGroupItem) => {
                    const oControl = oFilterGroupItem.getControl();

                    if (oControl instanceof sap.m.Input) {
                        const sInputValue = oControl.getValue();
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
                        const sInputValue = oControl.getValue();
                        const vS = this._convert_Date(oControl.getFrom());
                        const vE = this._convert_Date(oControl.getTo());

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
                        const aTokens = oControl.getTokens();
                        if (aTokens.length > 0) {
                            aTokens.forEach(oToken => {
                                const sTokenValue = oToken.getText();
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


                oModel.read("/TimeSheetDetails", {
                    filters: aTableFilters,
                    urlParameters: { "$expand": "ItsAllowances" },
                    success: (oData) => {
                        this.onCalculateData(oData.results);
                        oBusydailog.close();
                    },
                    error: () => oBusydailog.close()
                });
            } else {
                MessageBox.error("Date is Mandatory");
            }
        },


        _convert_Date: function (value) {
            let date = new Date(value);
            let year = date.getFullYear(); // Get the year, month, and day
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let day = ("0" + date.getDate()).slice(-2);
            let isoDateString = year + "-" + month + "-" + day; // Form the ISO date format string
            return isoDateString;
        },
        onFilterBarClear: function () {
            this.getView().byId("idInputDepartment").setValue("");
            this.getView().byId("idInputDivision").setValue("");
            this.getView().byId("idInputLocation").setValue("");
            this.getView().byId("idInputLegal").setValue("");
            this.getView().byId("idInputJob").setValue("");
            this.getView().byId("idInputEmployeeName").setValue("");
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


                oDataModelSF.read("/FODynamicRole", {
                    // filters: [oFilter4, oFilter5],
                    urlParameters: { "$expand": "departmentNav" },
                    success: (oData, oResponse) => {
                        // Log departmentNav contentsss
                        console.log("Department Nav:", oData.results[0].departmentNav);
                    },
                    error: (error) => {
                        reject(error);
                        oBusydailog.close();
                    }
                });




                oDataModelSF.read("/EmpJob", {
                    filters: [oFilter1],
                    urlParameters: {
                        $expand: "userNav"
                    },
                    success: (response1) => {
                        // this.getView().getModel("EmpJob").setData(response1.results[0]);
                        if (response1.results.length !== 0) {


                            // that.getView().byId("idInputDepartment").setValue(response1.results[0].department);

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


        onMultiInputValueHelpRequest: function (oEvent) {
            this.openDialog("Department Select", "taqa.taqatimesheetmonthreport.view.department")
        },
        openDialog: function (name, path) {
            let sname = name;
            this.mDialogs = this.mDialogs || {};
            var oDialog = this.mDialogs[sname];
            if (!oDialog) {
                oDialog = this.loadFragment({
                    name: path,
                    type: "XML",
                    controller: this

                });
                this.mDialogs[sname] = oDialog;
            }
            oDialog.then(function (pDialog) {
                pDialog.setTitle(name)
                pDialog.open();
            });
        },

        onFODepartmentTableSelectDialogSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter({
                path: "name",
                operator: FilterOperator.Contains,
                value1: sValue,
                caseSensitive: false
            });
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onFODepartmentTableSelectDialogConfirm: function (oEvent) {
            var oMultiInput = this.byId("idInputDepartment");
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);

            var aContexts = oEvent.getParameter("selectedContexts");
            if (aContexts && aContexts.length) {
                aContexts.forEach(oContexts => {
                    oMultiInput.addToken(new Token({
                        text: oContexts.getObject().name
                    }));

                });

            }
        }

    });
});







// oDataModelSF.read("/FODynamicRole", {
//     // filters: [oFilter4, oFilter5],
//     urlParameters: { "$expand": "departmentNav" },
//     success: (oData, oResponse) => {
//         // Log departmentNav contentsss
//         console.log("Department Nav:", oData.results[0].departmentNav);
//     },
//     error: (error) => {
//         reject(error);
//         oBusydailog.close();
//     }
// });



