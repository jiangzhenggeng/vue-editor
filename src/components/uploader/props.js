export default {
	inputId: {
		typr: String,
		default: 'id-' + String(Math.random()).replace('.', '')
	},
	value: {
		type: Array,
		default: Array,
		required: true
	},
	name: {
		type: String,
		default: 'file',
	},
	accept: {
		type: String,
		default: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'
	},

	multiple: {
		type: Boolean,
		default: true
	},

	postAction: {
		type: String,
	},

	headers: {
		type: Object,
		default: Object,
	},

	data: {
		type: Object,
		default: Object,
	},

	timeout: {
		type: Number,
		default: 0,
	},

	size: {
		type: Number,
		default: 0,
	},

	formData: {
		type: Object,
		default: function () {
			return {};
		},
	},

	extensions: {
		type: Array,
		default: function () {
			return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
		},
	},

	value: {
		type: Array,
		default: Array,
	}
};