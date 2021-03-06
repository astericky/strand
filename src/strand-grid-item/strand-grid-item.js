/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/
(function(scope) {

	scope.GridItem = Polymer({
		is: 'strand-grid-item',

		behaviors: [
			StrandTraits.Refable
		],

		properties: {
			model: {
				type: Object,
				value: null
			},
			scope: Object,
			index: {
				type: Number,
			},
			_overridden: {
				type: Object,
				value: function () {
					return {};
				},
			},
			inactive: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			}
		},

		observers: [
			"_expansionChanged(model.expanded)",
			"_redistributeColumns(scope._columns)",
		],

		_expansionChanged: function (expanded) {
			this.toggleClass("expanded", !!expanded, this.$.carat);
		},

		_redistributeColumns: function (columns) {
			this.distributeContent();
		},

		_checkDistributedNodesAsync: function(e) {
			this.debounce("checkDistributedNodes", this._checkDistributedNodes);
		},

		_checkDistributedNodes: function () {
			var contents = Polymer.dom(this.$.columnContainer).querySelectorAll("content");
			var count = contents.length;
			var index = 0;
			var c = null;

			for (index = 0; index < count; index++) {
				c = contents[index];
				if (Polymer.dom(c).getDistributedNodes().length) {
					this.set("_overridden."+c.id, 0|true);
				}
			}
		},

		_isOverridden: function (field) {
			return this._overridden[field];
		},

		_columnContentSelector: function (field) {
			return "[field='"+field+"']";
		},

		_computeColumnValue: function(field, model, modelChange) {
			return model ? model[field] : "";
		},

		_computeColumnClass: function (alignColumn) {
			return "_mm_column " + (alignColumn || "");
		},

		_computeColumnStyle: function(value) {
			return 'width: ' + value;
		},

		_setRandomWidth: function(field) {
			var n = 0.5;
			var width = Math.random() * (1.0 - n) + n;
			return String(Math.round(width*100) + "%");
		},

		_onItemSelected: function(e, detail, sender) {
			e.stopImmediatePropagation();
			this.fire("item-selected", this.model);
		},

		_onItemExpanded: function(e, detail, sender) {
			e.stopImmediatePropagation();
			if (this.model) {
				this.set("model.expanded", !this.model.expanded);
				this.async(function () {
					this.fire("item-resized", this.model.expanded);
				});
			}
		}
	});

})(window.Strand = window.Strand || {});
