var Person = Model.extend({
	getFullName: function() {
		return this.get('name') + ' de Persoon';
	}
});

var PersonController = Controller.extend({
	initialize: function() {
		this.model = new Person({ name: 'Henk' });
		this.view = $('#model-name');
		
		this.view.text(this.model.getFullName());
		
		this.model.on('change:name', $.proxy(this.displayChangedName, this));
		$('#change-name').click($.proxy(this.askNewName, this));
	},

	askNewName: function() {
		var newName = prompt('Enter new name:', this.model.get("name"));
		this.model.set({ name: newName });
	},
	
	displayChangedName: function() {
		this.view.text(this.model.getFullName());
	}
});

$(function() {
	new PersonController();
});