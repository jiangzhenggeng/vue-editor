<template>
  <label class="upload__label" ref="upload__label">
    <slot></slot>
    <input-file/>
  </label>
</template>
<style lang="less" scoped>
  .upload__label {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
<script>

	import InputFile from './input.vue';
	import props from './props';

	var el = [];
	export default {
		props: props,

		data() {
			return {
				files: this.value,
			}
		},
		watch: {
			files() {
				this.$emit('input', this.files)
			}
		},
		components: {
			InputFile
		},
		methods: {
			addBtn(_el) {
				_el.onclick = () => {
					this.$refs['upload__label'].click();
				}
				el.push(_el);
			},
			beforeDestroy() {
				el.forEach(item => {
					item.onclick = null;
				});
				el = null;
			},
			change(e) {
				let el = e.target;
				if (!el.files) return;
				if (!this.multiple) {
					this.clear();
				}
				for (let i = 0; i < el.files.length; i++) {
					let file = el.files[i];
					var fileCell = this.upload({
						id: 'id-' + String(Math.random()).replace('.', ''),
						size: file.size,
						name: file.name,
						type: file.type,
						file,
						el
					});
					this.files.push(fileCell);
				}
			},
			upload(fileCell) {

				var file = fileCell.file;
				var formData = new FormData()
				var value;

				for (let key in this.formData) {
					value = this.formData[key]
					if (value && typeof value === 'object' && typeof value.toString !== 'function') {
						formData.append(key, JSON.stringify(value))
					} else if (value !== null && value !== undefined) {
						formData.append(key, value)
					}
				}

				formData.append(this.name, file);
				const xhr = new XMLHttpRequest()
				if (this.timeout > 0) {
					xhr.timeout = this.timeout;
				}
				fileCell.progress = 0;
				fileCell.status = 'uploading';
				xhr.upload.onprogress = (e) => {
					if (!e.lengthComputable) return;
					fileCell.progress = (e.loaded / e.total * 100).toFixed(2);
					this.update(fileCell);
				};

				xhr.onerror = () => {
					fileCell.status = 'error';
					this.update(fileCell);
					xhr.abort();
				};
				xhr.onabort = () => {
					fileCell.status = 'abort';
					this.update(fileCell);
					xhr.abort();
				};
				xhr.ontimeout = () => {
					fileCell.status = 'timeout';
					this.update(fileCell);
					xhr.abort();
				};

				xhr.responseType = 'json';
				xhr.onload = () => {
					if (xhr.status === 200 || xhr.status === 304) {
						fileCell.response = xhr.response;
						fileCell.src = xhr.response.url;
						fileCell.status = 'success';
					} else {
						fileCell.status = 'fail';
					}
					this.update(fileCell);
				}
				xhr.open('POST', this.postAction, true)
				xhr.send(formData);
				fileCell.xhr = xhr;

				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (e) => {
					fileCell.base64 = e.currentTarget.result;
					this.update(fileCell);
				}

				return fileCell;
			},
			update(fileCell) {
				this.files = this.files.map((item) => {
					if (item.id == fileCell.id) {
						return fileCell;
					}
					return item;
				})
			},
			deleteFile(file) {
				this.files = this.files.filter((item) => {
					if (item.id == file.id) {
						this.clear(file);
						return false;
					}
					return true;
				})
			},
			reUploadFile(file) {
				this.upload(file);
			},
			clear(file) {
				if (file) {
					this.files = this.files.filter((item) => {
						if (item.id == file.id) {
							try {
								item.xhr.abort();
							} catch (e) {

							}
							item.xhr = null;
							return false;
						}
						return true;
					})
				} else {
					this.files.forEach((item) => {
						try {
							item.xhr.abort();
						} catch (e) {

						}
						item.xhr = null;
					})
					this.files = [];
				}
			}
		}
	}
</script>
