var Person = Model.extend({
	getFullName: function() {
		return this.get('name') + ' de Persoon';
	}
});

$(function() {
	var model = new Person({ name: 'Henk' });
	var view = $('#model-name');
	
	view.text(model.getFullName());

	model.on('change:name', function() {
		view.text(model.getFullName());
	});
	
	$('#change-name').click(function() {
		var newName = prompt('Enter new name:', model.get("name"));
		model.set({ name: newName });
	});
});