var $=require('./jquery.min.js')
var serverContext = $('meta[name=\'ServerContext\']')
	, serverContext = serverContext ? serverContext.attr('content') : ''
String.prototype.startsWith = String.prototype.startsWith || function(t) {
	return new RegExp('^' + t).test(this)
}
	,
	String.prototype.endsWith = String.prototype.endsWith || function(t) {
		return new RegExp(t + '$').test(this)
	}

var xform = {
	version: '12.7.0',
	conf: {
		maxImageSize: 1048576,
		maxFileSize: 4194304
	},
	items: {},
	_xtypes: {},
	_init: function() {
		if (this.urlParam = {},
			window.location.search)
			for (var param = window.location.search.substring(1).split('&'), i = 0; i < param.length; i++) {
				var kv = param[i].split('=')
				this.urlParam[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1])
			}
		if (this.view = $('.xform'),
			this.view.data('xform', this),
			this.items = this._findXItems($('body')),
		'object' == typeof xformInitValue)
			try {
				this.value = xformInitValue
			} catch (t) {}
		var key, id, param
		0 < this.view.length && (this.urlParam._key = this.urlParam._key || '',
			key = this.urlParam._key,
		this.items._key && (key = this.items._key.value),
			this.urlParam._id ? (id = this.urlParam._id,
					'*' == id ? id = xform.util.uuid() : (param = {
						_key: key,
						_func: 'sdown',
						_id: id,
						_rformat: 'json'
					},
						xform.util.download(param, function(text) {
							if (text)
								try {
									0 == text.indexOf('{') && eval('xform.value = ' + text)
								} catch (t) {
									xform.msg.err(t.message)
								}
						})),
					xform.submit = function() {
						xform.util.invoke({
							_key: key,
							_func: 'sup',
							_id: id,
							_rformat: 'json',
							_xdoc: xform.view.find('input[name=\'_xdoc\']').val(),
							_data: JSON.stringify(xform.value)
						}, function(t) {
							xform.msg.info(t.value)
						})
					}
			) : this.view.attr('action').endsWith('/xdoc') ? (0 == $('select[name=\'_format\'').length && this.view.append($('<select id=\'_format\' name=\'_format\' class=\'form-control\' style=\'margin-top:10px;\'><option value=\'html\'>html</option><option value=\'docx\'>docx</option><option value=\'pdf\'>pdf</option><option value=\'png\'>png</option></select>')),
				this.param = {
					_key: key,
					_runinput: !0
				}) : this.view.html(''),
			this.view.after($('<button id=\'_submit\' type=\'button\' class=\'btn btn-primary btn-block\' style=\'margin:10px 0px;\' onclick=\'xform.submit()\'>确定</button>')))
	},
	_genParam: function() {
		var t, e = {}
		for (t in this.items)
			e[t] = this.items[t].value
		this.param = e
	},
	get param () {
		this._genParam()
		var t = {}
		return this.view.find('input,select').each(function() {
			t[$(this).attr('name')] = $(this).val()
		}),
			t
	},
	set param (t) {
		var e, i = {}
		for (e in this.view.find('input,select').each(function() {
			i[$(this).attr('name')] = $(this)
		}),
			t) {
			e.startsWith('_') && this.items[e] && (this.items[e].value = t[e])
			var a = i[e]
			a || ((a = $('<input type=\'hidden\'>')).attr('name', e),
				this.view.append(a)),
				a.val('object' == typeof t[e] ? JSON.stringify(t[e]) : t[e])
		}
	},
	_findXItems: function(t, i) {
		return null == i && (i = {}),
			t.children().each(function() {
				var t, e
				$(this).hasClass('xitem') ? (t = $(this).attr('name'),
				(e = xform._xtypes[$(this).attr('xtype')]) && t && (i[t] = new e($(this)))) : xform._findXItems($(this), i)
			}),
			i
	},
	get value () {
		var t, e = {}
		for (t in this.items)
			0 != t.indexOf('_') && (e[t] = this.items[t].value)
		return e
	},
	set value (t) {
		for (var e in t)
			0 != e.indexOf('_') && this.items[e] && (this.items[e].value = t[e])
	},
	submit: function() {
		this._genParam(),
			this.view.submit()
	},
	// 设置值
	setFormValue (value) {
		var t = value
		try {
			0 == t.indexOf('{') && eval('xform.value = ' + t)
		} catch (t) {
			xform.msg.err(t.message)
		}
	},
	// 获取值
	getFormValue () {
		return xform.value
	}

}
xform.util = {
	formatByte: function(t) {
		return t < 1024 ? t + 'B' : t < 1048576 ? Math.round(t / 10.24) / 100 + 'KB' : Math.round(t / 1024 / 10.24) / 100 + 'MB'
	},
	uuid: function() {
		for (var t = 'abcdefghijklmnopqrstuvwxyz234567', e = '', i = 0; i < 26; i++)
			e += t.charAt(Math.floor(Math.random() * Math.floor(t.length)))
		return e
	},
	download: function(t, e) {
		xform.msg.beginLoading(),
			$.ajax({
				url: 'xdoc',
				type: 'POST',
				data: t,
				dataType: 'text',
				success: function(t) {
					xform.msg.endLoading(),
					e && e(t)
				},
				error: function(t, e, i) {
					xform.msg.endLoading(),
						xform.msg.err(i)
				}
			})
	},
	invoke: function invoke (param, callback) {
		param._rformat = 'json',
			xform.util.download(param, function(text) {
				var data = {}
				try {
					eval('data = ' + text),
						data.success ? callback(data.result) : xform.msg.err(data.error)
				} catch (t) {
					xform.msg.err(t.message)
				}
			})
	},
	zoomImg: function(t, n) {
		var o = new Image
		o.onload = function() {
			var t = this.width
				, e = this.height
				, i = 800
				, a = i < t || i < e ? (t *= i = e < t ? i / t : i / e,
				e *= i,
				i = (a = document.createElement('canvas')).getContext('2d'),
				$(a).attr({
					width: t,
					height: e
				}),
				i.drawImage(this, 0, 0, t, e),
				a.toDataURL()) : o.src
			n(a)
		}
			,
			o.src = t
	},
	dataToHtml: function(t, e) {
		this.download({
			_func: 'hpza6ns4tbglvjbnqembwdo6wm',
			_xdoc: t
		}, function(t) {
			e(t)
		})
	}
},
	xform.icon = {
		'plus-circle-fill': '<svg width=\'1em\' height=\'1em\' viewBox=\'0 0 16 16\' class=\'bi bi-plus-circle-fill\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'>  <path fill-rule=\'evenodd\' d=\'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z\'/></svg>',
		'x-circle': '<svg width=\'1em\' height=\'1em\' viewBox=\'0 0 16 16\' class=\'bi bi-x-circle\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'>  <path fill-rule=\'evenodd\' d=\'M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\'/>  <path fill-rule=\'evenodd\' d=\'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z\'/></svg>',
		'x-circle-fill': '<svg width=\'1em\' height=\'1em\' viewBox=\'0 0 16 16\' class=\'bi bi-x-circle-fill\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'>  <path fill-rule=\'evenodd\' d=\'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z\'/></svg>',
		'gear-fill': '<svg width=\'1em\' height=\'1em\' viewBox=\'0 0 16 16\' class=\'bi bi-gear-fill\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'>  <path fill-rule=\'evenodd\' d=\'M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z\'/></svg>',
		'toggle-off': '<svg width=\'1em\' height=\'1em\' viewBox=\'0 0 16 16\' class=\'bi bi-toggle-off\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'>  <path fill-rule=\'evenodd\' d=\'M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z\'/></svg>',
		'toggle-on': '<svg width=\'1em\' height=\'1em\' viewBox=\'0 0 16 16\' class=\'bi bi-toggle-on\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'>  <path fill-rule=\'evenodd\' d=\'M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8z\'/></svg>'
	},
	xform.msg = {
		_alert: function(t, e) {
			var i = $('#_msg')
			0 == i.length && (i = $('<div id=\'_msg\' class=\'alert\' style=\'position:fixed;top:20px;display:none;z-index:10000;left:50%;transform:translateX(-50%);\' role=\'alert\'><button type=\'button\' class=\'close\' onclick=\'xform.msg._close()\'><span>&times;</span></button><span id=\'_content\'></span></div>').appendTo($('body'))),
				i.find('#_content').text(t),
				i.removeClass().addClass('alert alert-dismissible ' + e).fadeIn(100).delay(2e3).fadeOut(500)
		},
		_close: function() {
			$('#_msg').hide()
		},
		info: function(t) {
			this._alert(t, 'alert-success')
		},
		warn: function(t) {
			this._alert(t, 'alert-warning')
		},
		err: function(t) {
			this._alert(t, 'alert-danger')
		},
		beginLoading: function() {
			var t, e = $('#_loading')
			0 == e.length && (e = $('<div id=\'_loading\' class=\'text-center\' style=\'left:0px;top:0px;width:100%;height:100%;position:fixed;background-color:#808080;opacity:0.5;;z-index:999999;display:none;\'><span class=\'btn btn-primary btn-lg text-info\' style=\'position: relative;top:50%;transform:translateY(-50%);\'></span></div>'),
				t = $(xform.icon['gear-fill']).css({
					'-webkit-animation': 'bi-spin 2s infinite linear',
					animation: 'bi-spin 2s infinite linear',
					width: '5em',
					height: '5em'
				}),
				e.find('.btn').append(t),
				e.appendTo($('body'))),
				e.show()
		},
		endLoading: function() {
			$('#_loading').hide()
		}
	}
var XFormInput = function(t) {
	return this.ele = t,
		Object.defineProperty(this, 'value', {
			get: function() {
				return this.ele.val()
			},
			set: function(t) {
				this.ele.val(t)
			}
		}),
		this
}
xform._xtypes.text = XFormInput,
	xform._xtypes.textarea = XFormInput,
	xform._xtypes.select = XFormInput,
	xform._xtypes.date = XFormInput,
	xform._xtypes.datetime = XFormInput,
	xform._xtypes.color = XFormInput,
	xform._xtypes.hidden = XFormInput
var XFormCheckbox = function(t) {
	return this.ele = t,
		Object.defineProperty(this, 'value', {
			get: function() {
				return this.ele[0].checked
			},
			set: function(t) {
				this.ele[0].checked = 'true' == String(t)
			}
		}),
		this
}
xform._xtypes.checkbox = XFormCheckbox
var XFormSwitch = function(t) {
	return this.ele = t,
		this.ele.css({
			'text-align': 'left'
		}),
		this.icon = $('<i></i>').css({
			'font-size': '1.5em',
			'line-height': '1em',
			'margin-right': '5px',
			'pointer-events': 'none'
		}).prependTo(this.ele),
		this.target = $(this.ele.attr('href')).css({
			border: '1px solid #ddd',
			padding: '5px',
			'margin-top': '-8px'
		}),
		this.items = xform._findXItems(this.target),
		this.ele.data('xitem', this),
		this.ele.click(function(t) {
			$(t.target).data('xitem').checked = !$(t.target).data('xitem').checked
		}),
		Object.defineProperty(this, 'checked', {
			get: function() {
				return this.icon.data('checked')
			},
			set: function(t) {
				this.icon.html(''),
					t ? (this.icon.append($(xform.icon['toggle-on'])),
						this.icon.removeClass('text-default').addClass('text-primary'),
						this.target.show()) : (this.icon.append($(xform.icon['toggle-off'])),
						this.icon.removeClass('text-primary').addClass('text-default'),
						this.target.hide()),
					this.icon.data('checked', t)
			}
		}),
		Object.defineProperty(this, 'value', {
			get: function() {
				if (this.checked) {
					var t, e = {}
					for (t in this.items)
						e[t] = this.items[t].value
					return e
				}
				return null
			},
			set: function(t) {
				if (t) {
					for (var e in t)
						this.items[e] && (this.items[e].value = t[e])
					this.checked = !0
				} else
					this.checked = !1
			}
		}),
		this.checked = !0,
		this
}
xform._xtypes.switch = XFormSwitch
var XFormTableRow = function(t, e, i) {
	e.data('xtablerow', this)
	var a = $('<a class=\'btn btn-sm btn-default\'/>').append($(xform.icon['plus-circle-fill']))
		, n = $('<a class=\'btn btn-sm btn-default\'/>').append($(xform.icon['x-circle']))
	$('<td nowrap/>').append(a).append('<i>&nbsp;</i>').append(n).appendTo(e)
	return this.items = xform._findXItems(e),
		Object.defineProperty(this, 'value', {
			get: function() {
				var t, e = {}
				for (t in this.items)
					e[t] = this.items[t].value
				return e
			},
			set: function(t) {
				for (var e in t)
					this.items[e] && (this.items[e].value = t[e])
			}
		}),
	i && (this.value = i),
		a.data('xitem', t),
		a.click(function() {
			var t = $(this).data('xitem')
				, e = $(t._row)
			$(this).parent().parent().after(e),
				t._initRow(t, e)
		}),
		n.data('xitem', t),
		n.click(function() {
			var t = $(this).data('xitem')
			1 == t.rows().length && t.ele.show(),
				$(this).parent().parent().remove()
		}),
		this
}
	, XFormTable = function(t) {
	this.ele = t,
		this._mark = xform.util.uuid(),
		this.rows = function() {
			return this.ele.parent().children('tr[mark=\'' + this._mark + '\']')
		}
		,
		this.ele.data('xitem', this),
		this.ele.attr('mark', this._mark),
		this._row = this.ele[0].outerHTML,
		this.ele.attr('mark', '')
	t = $('<a class=\'btn btn-sm btn-block btn-default\'/>').append($(xform.icon['plus-circle-fill']))
	t.data('xitem', this),
		t.click(function() {
			var t = $(this).data('xitem')
				, e = $(t._row)
			t.ele.after(e),
				t._initRow(t, e),
				t.ele.hide()
		})
	var e = 0
		, i = null
	return this.ele.children('td').each(function() {
		(i = $(this)).attr('colspan') ? e += parseInt(i.attr('colspan')) : e++
	}),
		this.ele.empty(),
		i.empty(),
		i.attr('colspan', e).append(t).appendTo(this.ele),
		this._initRow = function(t, e, i) {
			new XFormTableRow(t, e, i)
		}
		,
		t.click(),
		Object.defineProperty(this, 'value', {
			get: function() {
				var e = []
				return this.rows().each(function() {
					var t = $(this).data('xtablerow')
					t && e.push(t.value)
				}),
					e
			},
			set: function(t) {
				this.rows().remove()
				for (var e = this.ele, i = 0; i < t.length; i++) {
					var a = $(this._row)
					e.after(a),
						this._initRow(this, a, t[i]),
						e = a
				}
				0 < t.length ? this.ele.hide() : this.ele.show()
			}
		}),
		this
}
xform._xtypes.table = XFormTable
var XFormFileSelector = function(t) {
	var e, i
	this.option = t,
		'function' == typeof FileReader ? (e = $('<input type=\'file\'>').appendTo(this.option.container),
		t.image && e.attr('accept', 'image/*'),
			e.css({
				opacity: 0,
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				'font-size': '1000px'
			}),
			e.data('option', t),
			e.change(function(t) {
				if (t.target.files && 0 < t.target.files.length) {
					var e = $(t.target)
						, i = e.data('option')
						, a = t.target.files[0]
					if (i.maxSize && a.size > xform.conf.maxSize)
						return e.val(''),
							void xform.msg.warn('文件大小' + xform.util.formatByte(a.size) + '，超出最大限制' + xform.util.formatByte(xform.conf.maxImageSize))
					t = new FileReader
					t.onload = function(t) {
						i.image ? xform.util.zoomImg(t.target.result, function(t) {
							i.onselect && i.onselect({
								name: a.name,
								data: t
							}),
								e.val('')
						}) : (i.onselect && i.onselect({
							name: a.name,
							data: t.target.result
						}),
							e.val(''))
					}
						,
						t.readAsDataURL(a)
				}
			})) : (i = xform.util.uuid(),
			this.option.container.attr('id', i),
			this.option.container.data('onselect', this.option.onselect),
		XFormFileSelector._onselect || (XFormFileSelector._onselect = function(t, e, i) {
				$('#' + t).data('onselect')({
					name: e,
					data: i
				})
			}
		),
			e = serverContext + '/form/images/FileSelector.swf',
			i = 'id=' + i + '&alert=' + encodeURIComponent('xform.msg.warn') + '&onselect=' + encodeURIComponent('XFormFileSelector._onselect'),
		t.maxSize && (i += '&maxSize=' + t.maxSize),
		t.image && (i += '&format=' + encodeURIComponent('*.png;*.jpg;*.gif')),
			(t = $('<div></div>').appendTo(this.option.container)).css({
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%'
			}),
			t[0].innerHTML = '<object classid=\'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\' codebase=\'http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab\' width=\'100%\' height=\'100%\' style=\'display:block;\'><param name=\'movie\' value=\'' + e + '\'><param name=\'FlashVars\' value=\'' + i + '\'><param name=\'quality\' value=\'high\'><param name=\'wmode\' value=\'transparent\'><param name=\'bgcolor\' value=\'#000000\'><param name=\'allowScriptAccess\' value=\'always\'><param name=\'allowFullScreen\' value=\'false\'><comment><embed src=\'' + e + '\' quality=\'high\' wmode=\'transparent\' bgcolor=\'#000000\' style=\'display:block;\' width=\'100%\' height=\'100%\' align=\'middle\' play=\'true\' loop=\'false\' allowScriptAccess=\'always\' allowFullScreen=\'false\' type=\'application/x-shockwave-flash\' FlashVars=\'' + i + '\' pluginspage=\'http://www.adobe.com/go/getflashplayer\'></embed></comment></object>')
}
	, XFormImage = function(t) {
	this.ele = t,
		this.ele.data('xitem', this)
	var e = $('<div style=\'text-align:center;\'></div>')
	this.img = $('<img class=\'img-responsive\' style=\'max-height:200px\'>').appendTo(e)
	var i = $('<div class=\'input-group\'></div>').appendTo(e)
		,
		t = $('<div class=\'form-control file-selector\' style=\'position: relative;text-align:left;\'><div style=\'height:20px;overflow:hidden\'>请选择文件</div></div>').appendTo(i)
		, a = this
	new XFormFileSelector({
		container: t,
		image: !0,
		maxSize: xform.conf.maxImageSize,
		onselect: function(t) {
			a.value = t.data
		}
	}),
		this.ele.before(e),
		this.btn = $('<div class=\'input-group-addon\'></div>').append($(xform.icon['x-circle-fill'])).appendTo(i),
		this.btn.data('xitem', this),
		this.btn.click(function(t) {
			$(t.target).data('xitem').value = ''
		}),
		Object.defineProperty(this, 'value', {
			get: function() {
				return this.ele.val()
			},
			set: function(t) {
				this.ele.val(t),
					this.img.attr('src', t)
			}
		}),
		this.value = this.value
}
xform._xtypes.image = XFormImage
var XFormFile = function(t) {
	this.ele = t,
		this.name = '',
		this.ele.data('xitem', this)
	var e = $('<div class=\'input-group\'></div>')
	this.ele.before(e)
	t = $('<div class=\'form-control\' style=\'position: relative;\'></div>').appendTo(e)
	this.filename = $('<div style=\'height:20px;overflow:hidden\'></div>').appendTo(t)
	var i = this
	new XFormFileSelector({
		container: t,
		image: !1,
		maxSize: xform.conf.maxFileSize,
		onselect: function(t) {
			i.value = t
		}
	}),
		this.btn = $('<div class=\'input-group-addon\'></div>').append($(xform.icon['x-circle-fill'])).appendTo(e),
		this.btn.data('xitem', this),
		this.btn.click(function(t) {
			$(t.target).data('xitem').value = {
				name: '',
				data: ''
			}
		}),
		Object.defineProperty(this, 'value', {
			get: function() {
				return {
					name: this.name,
					data: this.ele.val()
				}
			},
			set: function(t) {
				this.name = t.name,
					this.filename.text(this.name ? this.name : '请选择文件'),
					this.ele.val(t.data)
			}
		}),
		this.value = this.value
}
xform._xtypes.file = XFormFile
var XFormHtml = function(t) {
	this.ele = t,
		this._editor = new Simditor({
			textarea: this.ele,
			toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'alignment', 'ol', 'ul', 'link', 'indent', 'outdent', '|', 'hr', 'image', 'table']
		})
	t = this._editor.el.find('.link-popover')
	$(t.find('.settings-field')[2]).remove(),
		t.find('input').width(300).addClass('form-control'),
		t.find('.settings-field').height(32),
		this._editor.el.find('.image-popover').html('').css('visibility', 'hidden')
	t = this._editor.el.find('.toolbar-item-image')
	t.css({
		position: 'relative',
		overflow: 'hidden'
	}),
		t.unbind(),
		t.parent().unbind(),
		t.parent().parent().unbind()
	var e = this
	new XFormFileSelector({
		container: t,
		image: !1,
		maxSize: xform.conf.maxFileSize,
		onselect: function(t) {
			t.data.startsWith('data:image/') ? xform.util.zoomImg(t.data, function(t) {
				e._insertHtml('<p><img src=\'' + t + '\'></p>')
			}) : xform.util.dataToHtml(t.data, function(t) {
				e._insertHtml(t)
			})
		}
	}),
		this._insertHtml = function(t) {
			this._editor.focus(),
				range = this._editor.selection.range(),
				$(range.startContainer).after($(t)),
				this._editor.trigger('valuechanged')
		}
		,
		Object.defineProperty(this, 'value', {
			get: function() {
				return this._editor.getValue()
			},
			set: function(t) {
				this._editor.setValue(t)
			}
		})
}
xform._xtypes.html = XFormHtml,
	$(document).ready(function() {
		function initChart () {
			$('.xchart').each(function() {
				var chart = echarts.init($(this)[0])
				eval('chart.setOption(' + $(this).attr('data-option') + ')'),
					$(this).data('chart', chart),
					$(this).data('resize', function() {
						var t = parseFloat($(this).attr('data-aspectratio'))
							, e = Math.max(Math.min($(this).parent().width(), 750), 300)
							, t = e / t
						$(this).width(e),
							$(this).height(40 + t),
							$(this).data('chart').resize()
					}),
					$(this).css('margin', 'auto'),
					$(this).data('resize').call($(this))
			}),
				$(window).resize(function() {
					$('.xchart').each(function() {
						$(this).data('resize').call($(this))
					})
				})
		}

		function initImageViewer () {
			$('p').FlyZommImg({
				miscellaneous: !1,
				closeBtn: !0,
				slitherCallback: function(t, e) {
					setTimeout(function() {
						$('.fly-zoom-box-img').css('width', '100%').css('height', 'auto').css('top', 0).css('bottom', 0).css('margin', 'auto')
					}, 100)
				}
			})
		}

		xform._init(),
			$('.btn-tr-toggle').html('[+]').data('expand', !1).click(function() {
				$(this).data('expand') ? ($(this).parent().find('.tr-toggle').each(function() {
					$(this).hide()
				}),
					$(this).html('[+]').data('expand', !1)) : ($(this).parent().find('.tr-toggle').each(function() {
					$(this).show()
				}),
					$(this).html('[-]').data('expand', !0))
			}),
		0 < $('.xchart').length && $.ajax({
			url: serverContext + '/form/js/echarts.min.js',
			dataType: 'script',
			cache: !0,
			success: initChart
		}),
		$('html').width() < 992 && 0 < $('.img-responsive').length && $.ajax({
			url: serverContext + '/form/js/imageViewer.min.js',
			dataType: 'script',
			cache: !0,
			success: initImageViewer
		})
		var showToolbar = 0 == xform.view.length
			, param = $.extend({}, xform.urlParam)
		if (param.p)
			try {
				var decodeUTF8 = function(t) {
					for (var e, i = '', a = 0, n = 0; a < t.length;)
						(e = t.charCodeAt(a)) < 128 ? (i += String.fromCharCode(e),
							a++) : 191 < e && e < 224 ? (n = t.charCodeAt(a + 1),
							i += String.fromCharCode((31 & e) << 6 | 63 & n),
							a += 2) : (n = t.charCodeAt(a + 1),
							c3 = t.charCodeAt(a + 2),
							i += String.fromCharCode((15 & e) << 12 | (63 & n) << 6 | 63 & c3),
							a += 3)
					return i
				}
				eval('param=' + decodeUTF8(window.atob(param.p)))
			} catch (t) {}
		if (param._title && (document.title = param._title),
			param._watermark) {
			var wm = document.createElement('div')
			try {
				for (var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'), fontSize = 60, fontSize2 = 40, font = 'normal ' + fontSize + 'px sans-serif', font2 = 'normal ' + fontSize2 + 'px sans-serif', txts = param._watermark.split('\n'), tw = 0, th = 0, i = 0; i < txts.length; i++)
					ctx.font = 0 == i ? font : font2,
						tw = Math.max(ctx.measureText(txts[i]).width, tw),
						th += fontSize
				var minWidth = 320
					, w = Math.max(Math.max(tw, minWidth), th)
				canvas.setAttribute('width', w + 'px'),
					canvas.setAttribute('height', w + 'px'),
					ctx = canvas.getContext('2d'),
					ctx.translate(w / 2, w / 2),
					ctx.rotate(-Math.PI / 4),
					ctx.translate(-w / 2, -w / 2),
					ctx.fillStyle = '#000000'
				for (var y = (w - th) / 2, i = 0; i < txts.length; i++)
					ctx.font = 0 == i ? font : font2,
						tw = ctx.measureText(txts[i]).width,
						y += fontSize,
						ctx.fillText(txts[i], (w - tw) / 2, y)
				var wmImg = canvas.toDataURL('image/png')
				wm.style = 'top:0;left:0;width:100%;height:100%;position:fixed;z-index:9999;opacity:0.2;pointer-events:none;background:url(' + wmImg + ');background-size:' + minWidth + 'px ' + minWidth + 'px;background-position:center;'
			} catch (t) {
				wm.style = 'font-size:60px;word-break:break-all;text-align:center;position:fixed;z-index:9999;top:50%;left:50%;width:100%;padding:10px;transform:translate(-50%, -50%) rotate(-45deg);opacity:0.2;pointer-events:none;',
					wm.innerText = param._watermark
			}
			document.body.appendChild(wm)
		}
		if ('false' == param._copyable && (document.oncontextmenu = function(t) {
				t.preventDefault()
			}
				,
				document.onselectstart = function(t) {
					t.preventDefault()
				}
		),
		'false' == param._toolbar && (showToolbar = !1),
			showToolbar) {
			for (var icons = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAASFBMVEUAAACAgICAgICAgIB+fn6AgICBgYGBgYGCgoKAgICBgYGAgIB9fX2BgYF/f3+AgICAgICBgYGAgIB4eHiAgICAgICAgICAgIDKlCIuAAAAF3RSTlMAJghARb3yyTTgs6wf1o2bgVUXEZ9aChWExNIAAACeSURBVEjH7dW5DsMgEATQCYfBVy4nmf//06D1Sq4wpobXANKsgGIBbTI2MVA2T3Pfgcnwkvh7ZJ7mAkWQgjtLAjyFl4InSzysVEwWYmae5rou65YcizzNRemHsOzNNPHcELFSzBf7Ya0tYOWRGGsv3bXEJMciT3OLZzL/IB485xd4is/l537UiW5QMsLtY9y/rMACB2wuMVDu3IYm/QFVJSxkgymmMgAAAABJRU5ErkJggg==', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAgVBMVEUAAACAgICAgICAgICAgICAgIB/f3+AgICAgICAgICAgICAgICAgICAgICAgICBgYF/f3+BgYGBgYGBgYGAgICAgICAgICAgICCgoKCgoKAgICAgICAgICAgICAgICAgICCgoKBgYGEhIR9fX2BgYGAgICBgYGBgYGAgICAgICAgID96KQoAAAAKnRSTlMAv0CA3s4vs+3mqqCNiHFIOvnVw2NdU04XC7ykmpN3RSkgHRH0empYgiLToujyAAABXklEQVRIx+1VaXeCMBAEkRsUPLiqHLbWNv//B5YJFGJYaPhc5z1x32ZG9wzaC3Xo71cJdMYcawU/YS3CFYI3CLbq/CZmwENZsGMcnrLgyDrUivwN63FXFFxBNvFR4+dOy3VLqNSadwI1+MbzIp9FnnueCGxQI81rn05GnL1LPgt8ve/2p3QInyH5jF/itv0uFATgfSCUkIf2pyAdkrV48oSAmLuKmwUmMB/aCXABjIF/400T6ttXcX9gzzDEuSuFDtqdHTAZvcCE3YgzYi0Koqex7kJeDOkCO4E1/J+5lHQeozDSJqULZT1Ly5/hB3xaMK6aLgJtv80KakZiNysIacFxdrwdRmMzs0CJnAEA31WjYY+NHVFgwaUlE+fuAGsy7idScO8qIoONE0isWjx1B1SgQIUDf+Ye/KKvePrmMonUAH1sEXGNbEgBXQ3LpV8uJbaIROr7DeV/VJn2z/ADxG9NzMap7vQAAAAASUVORK5CYII=', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAjVBMVEUAAACAgICAgICAgICCgoKAgICAgICAgICAgICBgYGAgICAgICBgYGAgICBgYGAgICAgICAgICAgICAgICAgICAgICBgYGAgICAgICAgICAgICAgICAgICAgICAgICAgIB+fn6EhISAgICBgYF/f3+BgYGAgICAgICDg4N/f3+AgICAgICBgYGAgICAgIBE5IPPAAAALnRSTlMAv0BPH+yIgXFILAz44NXPpKCZjXdjVtzJwry0q5FFPTAW8eR9al06JxkF6MSvRV6p5QAAAVFJREFUSMftlOtygjAQhYNyUUARRKyoVFprtZd9/8drNtAMpJvM+rueGWGZOZ+E7NmIh65hPr8L8ACCWPA1BanwDmCFwPaD7fdTQFVsYAZKBzbwBZ2uTP8EepVM4IjmJ/zx/Ekgva8lUrzmbdB69PFasIA9Wt/FQV6DG8N/Qr8nRIX3NwYQ/Rq38l4zAPS9tLII1dJ4uSv02ta83DWqrGW1SHQ7R9J+tZvZYH8vXT1fwljRMHfloIPfXb0GUz2QYe33DwU+xE7gWcdaP52dSyrGg4MJzFwfnaS4McYkTYVdF2P4W/yD3AHsVI6Gwrb7Vn8MpGZWIKSBnRUIgNbElTvPkBo/16iZJ2qNA56Q/hv6l+RrNyRwpncEpPYksACA1DyA+9idCH8DdFdVAiN61OiTKyM+DeXZWhRZWuHZdiP+xAT/VSkBS0NXOZm/qmnFP9MPxBNMChJlyikAAAAASUVORK5CYII=', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAwCAMAAABkKdmIAAAARVBMVEUAAACAgICAgICAgICAgICBgYF/f3+AgICAgICAgICAgIB/f3+AgICAgICAgIB+fn5/f3+BgYGAgICAgICBgYF2dnaAgICy0av8AAAAFnRSTlMAv0CqKtTolN9rIcqfgEwwGvSviXMN6Aq7iwAAALFJREFUSMft01kKg0AQRdFqjfMQM7n/paYd4H7EWFUhP4IXBH1waBBafqtOzL0W0Y72ymo+Y/R0l6nSQ54z6dNgrkjkeF1DMfjEJf6c3CfyMZZ6RBYBxigwVoFxiRvGIkJ8mgyjizSZ2PpuEzITwehiIXzrYiUsqoCwKQLCqgkI+66AKKZhF4Fgio8rhYBgNq9PiYBgOIXqtpKvRIZHJftB6CQnOcn/iETSOUmXh162ewP5ayJY5g+YCwAAAABJRU5ErkJggg=='], bar = $('<div id=\'_docbar\'></div>').css({
				display: 'none',
				position: 'fixed',
				'z-index': '100',
				bottom: '0',
				width: '100%',
				background: 'white',
				'border-top': '1px solid #f0f0f0',
				'padding-bottom': '5px'
			}).appendTo($('body')), i = 0; i < icons.length; i++) {
				var icon = $('<a class=\'btn\'/>').css({
					width: '25%'
				}).appendTo(bar)
				$('<img>').attr('src', icons[i]).css({
					width: '20px',
					height: '20px'
				}).appendTo(icon),
					icons[i] = icon
			}
			icons[0].click(function() {
				0 < $('#sm-dir').length && ($('.container').toggle(),
					$('#sm-dir').toggle())
			}),
				$('#btn-dir').remove()
			var _fontDelta = 0

			function _zoomFontSize (t) {
				_fontDelta += t,
					$('span').each(function() {
						var t = $(this).data('_font-size')
						t || (t = parseInt($(this).css('font-size')),
							$(this).data('_font-size', t)),
							t = Math.max(t + _fontDelta, 6),
							$(this).css('font-size', t + 'px')
					})
			}

			icons[1].click(function() {
				_zoomFontSize(2),
					_preWindowScrollY = Number.MAX_VALUE
			}),
				icons[2].click(function() {
					_zoomFontSize(-2)
				}),
				icons[3].click(function() {
					$('html,body').animate({
						scrollTop: 0
					}, 500)
				}),
				$('<div id=\'_docbar_ph\'></div>').css({
					display: 'none',
					height: bar.height()
				}).appendTo($('body'))
			var _preWindowScrollY = 0

			function _doResize () {
				$('html').width() < 992 ? ($('#_docbar').show(),
					$('#_docbar_ph').show()) : ($('#_docbar').hide(),
					$('#_docbar_ph').hide())
			}

			$(window).scroll(function() {
				$('html').width() < 992 && (window.scrollY > _preWindowScrollY ? ($('#_docbar').hide(),
					$('#_docbar_ph').hide()) : window.scrollY < _preWindowScrollY && ($('#_docbar').show(),
					$('#_docbar_ph').show()),
					_preWindowScrollY = window.scrollY)
			}),
				$(window).resize(_doResize),
				_doResize()
		}
	})

export default xform
