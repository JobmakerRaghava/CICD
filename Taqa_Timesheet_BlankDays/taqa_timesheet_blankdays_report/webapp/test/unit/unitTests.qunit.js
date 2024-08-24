/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"taqa/taqa_timesheet_blankdays_report/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
