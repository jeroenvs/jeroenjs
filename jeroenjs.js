//
// Event bus for registering and triggering events
//

var Events = {
	on: function(name, callback) {
		this._events || (this._events = {});
		var events = this._events[name] || (this._events[name] = []);
		events.push({ callback: callback });
	},
	
	trigger: function(name, args) {
		if (!this._events || !this._events[name]) return this;
		var events = this._events[name];
		_.each(events, function(event) {
			event.callback(args);
		});
	}
};

// 
// Model that holds domain value
// 

var Model = function(attributes) {
	this._attributes = {};
	this.set(attributes || {});
	this.initialize.apply(this);
}

_.extend(Model.prototype, Events, {
	initialize: function() {
	},
	
	get: function(name) {
		return this._attributes[name];
	},

	set: function(attributes) {		
		if (!attributes) return this;

		var changed = false;
		var model = this;
		
		_.each(_.keys(attributes), function(name) {
			var curValue = model._attributes[name];
			var newValue = attributes[name];

			if (curValue !== newValue) {
				model._attributes[name] = newValue;
				model.trigger('change:' + name, newValue);
				changed = true;
			}
		});
		
		if (changed) {
			this.trigger('change');
		}
	}
});

//
// Controller used to link between the model and view
//

var Controller = function(attributes) {
	this.initialize.apply(this, attributes);
}

_.extend(Controller.prototype, Events, {
	initialize: function(attributes) {
	}
});

//
// Helper method
// 

extend = function(protoProps, staticProps) {
	var parent = this;
	var child;

	// The constructor function for the new subclass is either defined by you
	// (the "constructor" property in your extend definition), or defaulted by
	// us to simply call the parent's constructor.
	if (protoProps && _.has(protoProps, 'constructor')) {
		child = protoProps.constructor;
	} else {
		child = function() { return parent.apply(this, arguments); };
	}

	// Add static properties to the constructor function, if supplied.
	_.extend(child, parent, staticProps);

	// Set the prototype chain to inherit from parent, without calling parent's constructor function.
	var Surrogate = function() { this.constructor = child; };
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;

	// Add prototype properties (instance properties) to the subclass, if supplied.
	if (protoProps) _.extend(child.prototype, protoProps);

	// Set a convenience property in case the parent's prototype is needed later.
	child.__super__ = parent.prototype;

	return child;
}

Model.extend = Controller.extend = extend;
