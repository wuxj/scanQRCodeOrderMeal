let obj = {
	carBrand: {
		main: {
			1: [],
			2: [],
			3: []
		},
		second: {
			1: [],
			2: [],
			3: []
		}
	},
	category: {
		main: {
			1: [],
			2: [],
			3: []
		},
		second: {
			1: [],
			2: [],
			3: []
		}
	},
	/**
	 *
	 * @param param {string}
	 * @param type {int}
	 * 		0: main
	 * 		1: second
	 */
	initBrand: function (param, type = 0) {
		type = parseInt(type);
		let data = param.split(',');
		let temp = [];
		data.forEach((x) => {
			temp.push(x.split(/\s*[>\|]\s*/))
		});
		let item = {
			1: [],
			2: [],
			3: []
		};
		temp.forEach((x) => {
			switch (x[0]) {
				case '商用车':
					item[1].push(x[1]);
					break;
				case '乘用车':
					item[2].push(x[1]);
					break;
				case '工程机械':
					item[3].push(x[1]);
					break;
			}
		});
		let key = type === 0 ? 'main' : 'second';
		this.carBrand[key] = item;
		this.setSelectedCarBrand(this.carBrand);
	},
	/**
	 *
	 * @param param {string}
	 * @param type {int}
	 * 		0: main
	 * 		1: second
	 */
	initCategory: function (param, type = 0) {
		type = parseInt(type);
		let data = param.split(',');
		let temp = [];
		data.forEach((x) => {
			temp.push(x.split(/\s*[>\|]\s*/))
		});
		let item = {
			1: [],
			2: [],
			3: []
		};
		temp.forEach((x) => {
			let key = x[0];
			let v = (x.slice(1)).join('|');
			switch (key) {
				case '商用车配件':
					item[1].push(v);
					break;
				case '乘用车配件':
					item[2].push(v);
					break;
				case '工程机械配件':
					item[3].push(v);
					break;
			}
		});
		let key = type === 0 ? 'main' : 'second';
		this.category[key] = item;
		this.setSelectedCategory(this.category)
	},

	setSelectedCarBrand: function (data) {
		global.selectcarbrand = data;
	},
	getSelectedCarBrand: function () {
		return global.selectcarbrand;
	},
	setSelectedCategory: function(data) {
		global.selectcategory = data;
	},
	getSelectedCategory: function() {
		return global.selectcategory;
	},
};
export default obj;