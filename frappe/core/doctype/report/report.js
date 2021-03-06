cur_frm.cscript.report_type = function(doc) {
	cur_frm.set_intro("");
	switch(doc.report_type) {
		case "Report Builder":
			cur_frm.set_intro(__("Report Builder reports are managed directly by the report builder. Nothing to do."));
			break;
		case "Query Report":
			cur_frm.set_intro(__("Write a SELECT query. Note result is not paged (all data is sent in one go).")
				+ __("To format columns, give column labels in the query.") + "<br>"
				+ __("[Label]:[Field Type]/[Options]:[Width]") + "<br><br>"
				+ __("Example:") + "<br>"
				+ "Employee:Link/Employee:200" + "<br>"
				+ "Rate:Currency:120" + "<br>")
			break;
		case "Script Report":
			cur_frm.set_intro(__("Write a Python file in the same folder where this is saved and return column and result."))
			break;
	}
}

cur_frm.cscript.refresh = function(doc) {
	cur_frm.add_custom_button("Show Report", function() {
		switch(doc.report_type) {
			case "Report Builder":
				frappe.set_route('List', doc.ref_doctype, 'Report', doc.name);
				break;
			case "Query Report":
				frappe.set_route("query-report", doc.name);
				break;
			case "Script Report":
				frappe.set_route("query-report", doc.name);
				break;
		}
	}, "fa fa-table");

	if (doc.is_standard === "Yes") {
		cur_frm.add_custom_button(doc.disabled ? __("Enable Report") : __("Disable Report"), function() {
			$.ajax({
				url: "/api/resource/Report/" + encodeURIComponent(doc.name),
				type: "POST",
				data: {
					run_method: "toggle_disable",
					disable: doc.disabled ? 0 : 1
				}
			}).always(function() {
				cur_frm.reload_doc();
			});
		}, doc.disabled ? "fa fa-check" : "fa fa-off");
	}

	cur_frm.cscript.report_type(doc);
}


frappe.ui.form.on('Report', {
	refresh: function(frm) {
		if(!frappe.boot.developer_mode && user != 'Administrator') {
			// make the document read-only
			frm.set_read_only();
		}
	},

	ref_doctype: function(frm) {
		if(frm.doc.ref_doctype) {
			frm.trigger("set_doctype_roles")
		}
	},

	set_doctype_roles: function(frm) {
		return frappe.call({
			method: "set_doctype_roles",
			doc:frm.doc,
			callback: function(r) {
				refresh_field('roles')
			}
		})
	}
})
