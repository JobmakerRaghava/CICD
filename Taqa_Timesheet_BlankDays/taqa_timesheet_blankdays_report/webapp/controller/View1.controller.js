sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/export/Spreadsheet',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/m/MessageBox",
    "sap/m/IllustratedMessage"
], function (Controller, JSONModel, Spreadsheet, Filter, FilterOperator, Token, MessageBox, IllustratedMessage) {
    "use strict";

    return Controller.extend("taqa.taqatimesheetblankdaysreport.controller.View1", {
        onInit: async function () {
            if (sap.ushell.Container) {
                // console.log("Inside shell");
            try {
                let user = sap.ushell.Container.getService("UserInfo").getUser();
                let userEmail = user.getEmail();
                // userEmail = "vsreenivasulu@kaartech.com";

                let userD = await this.getEmpDetailsEmail(userEmail);

                if (userD.admin === "yes") {
                    let fnValidator = function (args) {
                        let text = args.text;
                        return new Token({ key: text, text: text });
                    };
                    let oMultiInput1 = this.getView().byId("idInput");
                    oMultiInput1.addValidator(fnValidator);

                    let oModel = this.getOwnerComponent().getModel(),
                        sPath = "/RowInfo",
                        filters = [],
                        filterByName,
                        filterByStartDate,
                        filterByEndDate,
                        that = this,
                        oBusydailog = new sap.m.BusyDialog();

                    oBusydailog.open();
                    filterByName = new Filter("TableName", FilterOperator.EQ, "CutOffCycles");
                    filterByStartDate = new Filter("Column1", FilterOperator.LE, this._convert_Date(new Date()));
                    filterByEndDate = new Filter("Column2", FilterOperator.GE, this._convert_Date(new Date()));
                    filters.push(filterByName, filterByStartDate, filterByEndDate);

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
                    // console.log("No");
                    this.displayAccessDenied();
                }

            } catch (e) {
                // Handle any errors
                // console.error("Error fetching user info:", e);
                this.displayAccessDenied();
            }
            } else {
                // console.log("Not entering fn");
                this.displayAccessDenied();
            }
        },

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
                            // console.log("email :", response1);
                        }
                        oBusydailog.close();
                    },
                    error: (error) => {
                        reject(error);
                        oBusydailog.close();
                    }
                });
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
                    fileName: 'Blank Days Report.xlsx',
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
        //             fileName: 'Blank Days Report.xlsx',
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
            let oJsonData = oAllRecords;
            oJsonData.sort((a, b) => {
                const employeeIdComparison = a.EmployeeID.localeCompare(b.EmployeeID);
                if (employeeIdComparison !== 0) {
                    return employeeIdComparison;
                }
                return a.Date.localeCompare(b.Date);
            });

            let oModel = new JSONModel(oJsonData);
            this.getView().setModel(oModel);

            let oTableTitle = this.getView().byId("idTitle");
            oTableTitle.setText("Employee Blank Days Report (" + oJsonData.length + ")");
        },

        onSearch: function () {
            let oDateRang = this.getView().byId("idDatePicker").getDateValue();
            if (oDateRang !== null) {
                let oFilterBar = this.getView().byId("filterbar"),
                    that = this,
                    aFilters = [],
                    oModel = this.getOwnerComponent().getModel(),
                    oBusydailog = new sap.m.BusyDialog();

                let aTableFilters = oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
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
                        let vS = that._convert_Date(oControl.getFrom());
                        let vE = that._convert_Date(oControl.getTo());
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
                                        operator: FilterOperator.Contains,
                                        value1: sTokenValue,
                                        and: true
                                    }));
                                }
                            });
                        }
                    }
                    return aFilters;
                }, []);

                oBusydailog.open();
                aTableFilters.push(new Filter({
                    path: 'Absence',
                    operator: FilterOperator.Contains,
                    value1: 'Unauthorized Absence (Z)'
                }));

                oModel.read("/TimeSheetDetails", {
                    filters: aTableFilters,
                    urlParameters: {
                        "$expand": "ItsAllowances",
                    },
                    success: function (oData) {
                        console.log("Data from the model without filters:", oData);
                        that.onCalculateData(oData.results);
                        oBusydailog.close();
                    },
                    error: function (oError) {
                        oBusydailog.close();
                        // console.error("Error fetching data:", oError);
                    }
                });
            } else {
                MessageBox.error("Date is Mandatory");
            }
        },

        _convert_Date: function (value) {
            let date = new Date(value);
            let year = date.getFullYear();
            let month = (date.getMonth() + 1).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        formatDate: function (sDate) {
            if (sDate) {
                let oDate = new Date(sDate);
                let day = oDate.getDate().toString().padStart(2, '0');
                let month = (oDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                let year = oDate.getFullYear().toString().slice(-2); // Last two digits of the year
                return `${day}-${month}-${year}`;
            }
            return sDate; // Return the original date if it's not valid
        },

        onFilterBarClear: function () {
            let oFilterBar = this.getView().byId("filterbar");
            let aFilterGroupItems = oFilterBar.getFilterGroupItems();
            // Clear all controls except DateRangeSelection
            aFilterGroupItems.forEach(function (oFilterGroupItem) {
                let oControl = oFilterGroupItem.getControl();
                if (oControl instanceof sap.m.MultiInput) {
                    oControl.removeAllTokens();
                } else if (oControl instanceof sap.m.Input) {
                    oControl.setValue("");
                }
            });
        },

        ReadOdata: function (oModel, sPath, oFilters, oUrlParameters = {}) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, {
                    filters: oFilters,
                    urlParameters: oUrlParameters,
                    success: function (odata) {
                        resolve(odata);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });
        }
    });
});
