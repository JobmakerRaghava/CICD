sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
          
            onInit: function () {


                // sap.ui.getCore().byId("shell-header-logo").attachPress(function (oData) {
                //     oData.preventDefault();
                //   })
                // sap.ui.getCore().attachInit(function() {
                    // Use a timeout to ensure the DOM is fully loaded
                    // setTimeout(function() {
                        // Target the logo element directly using its ID
                        // var oLogoElement = document.getElementById("shell-header-logo");
            
                        // if (oLogoElement) {
                        //     oLogoElement.addEventListener("click", function(event) {
                        //         event.preventDefault(); // Prevent the default action (navigation)
                        //         event.stopImmediatePropagation(); // Stop the event from propagating further
                        //         console.log("Logo click prevented.");
                        //     });
                        // } else {
                        //     console.error("Logo element not found.");
                        // }
                    // }, 500); // Adjust the delay if necessary
                // });

                // sap.ui.getCore().byId("shell-header").getModel().getData()['homeUri'] = 'https://sapui5.hana.ondemand.com/';
                // sap.ui.getCore().byId("shell-header").getModel().refresh();
               
                // let a =sap.ui.getCore().byId("shell-header")

            },
            onExit: function (params) {
                // sap.ui.getCore().byId("shell-header").getModel().getData()['homeUri']= 'https://sapui5.hana.ondemand.com/';
                // sap.ui.getCore().byId("shell-header").getModel().refresh();  
                // debugger
            },
            /**
             * @override
             */
            onAfterRendering: function() {
                // sap.ui.getCore().byId("shell-header").getModel().getData()['homeUri']= 'https://sapui5.hana.ondemand.com/';
                // sap.ui.getCore().byId("shell-header").getModel().refresh();  
                // debugger
                // debugger;
                // var homeBtn1 = sap.ui.getCore().byId("application-project1-display-component---View1--page-title").getDomRef();
            
                // var homeBtn = sap.ui.getCore().byId("shell-header").getDomRef();
            
                // $($(homeBtn).find("a")).on("click", function(event) {
                //     // do this if user do not want to navigate to launchpad
                //     event.preventDefault();
                // });
            },
            /**
             * @override
             */
           /**
            * @override
            */
           onBeforeRendering: function() {
            // sap.ui.getCore().byId("shell-header").getModel().getData()['homeUri']= 'https://sapui5.hana.ondemand.com/';
            // sap.ui.getCore().byId("shell-header").getModel().refresh();  
            // debugger
           
           },

		onButtonPress: function(oEvent) {
			
		}
        });
    });
