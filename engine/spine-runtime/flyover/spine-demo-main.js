/**
 * Copyright (c) 2013 Flyover Games, LLC
 *
 * Isaac Burns isaacburns@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall
 * be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @return {void}
 */
main.start = function ()
{
	var directions_div = document.body.appendChild(document.createElement('div'));
	var file_input_div = document.body.appendChild(document.createElement('div'));
	var canvas_div = document.body.appendChild(document.createElement('div'));
	var data_info_div = document.body.appendChild(document.createElement('div'));
	var skeleton_info_div = document.body.appendChild(document.createElement('div'));
	var animation_info_div = document.body.appendChild(document.createElement('div'));
	var control_div = document.body.appendChild(document.createElement('div'));

	//directions_div.innerHTML = "Drag a Spine JSON file and associated image directories to canvas.";

	canvas_div.style.display = 'inline-block';

	var canvas_w = 640;
	var canvas_h = 480;

	var camera_x = 0;
	var camera_y = 0;
	var camera_angle = 0;
	var camera_scale = 1;

	var set_camera = function (pose)
	{
		var extent = main.get_pose_extent(pose);
		for (var i = 0, ict = pose.getNumAnims(); i < ict; ++i)
		{
			pose.setAnim(i);
			// get extent for each step milliseconds
			var step = 100;
			for (var t = 0, tct = pose.getAnimLength(); t < tct; t += step)
			{
				pose.setTime(t);
				extent = main.get_pose_extent(pose, extent);
			}
			/*
			// get extent for each keyframe
			for (var k = 0, kct = pose.getNumAnimKeys(); k < kct; ++k)
			{
				pose.setKey(k);
				extent = main.get_pose_extent(pose, extent);
			}
			*/
		}
		pose.setAnim(0);
		camera_x = (extent.max.x + extent.min.x) / 2;
		camera_y = (extent.max.y + extent.min.y) / 2;
		var scale_x = canvas_w / (extent.max.x - extent.min.x);
		var scale_y = canvas_h / (extent.max.y - extent.min.y);
		camera_scale = 1 / Math.min(scale_x, scale_y);
		camera_scale *= 1.1;
	}

	var single_file = true;

	var pose = new spine.pose();
	var data = new spine.data();

	if (single_file) {
		var url  = "data/examples/dragon/dragon.json";

		data_info_div.innerHTML = "Loading...";
		main.load_data_from_url(data, url, (function (skeleton) { return function ()
		{
			data_info_div.innerHTML = "Name: " + url;

			pose = new spine.pose(data);

			for (var i in data.m_animations) { pose.setAnim(i); break; }

			set_camera(pose);
		}
		})(data));
	}

	var file_input = file_input_div.appendChild(document.createElement('input'));
	file_input.type = 'file';
	file_input.multiple = 'multiple';
	file_input.directory = file_input.webkitdirectory = file_input.mozdirectory = "directory";
	var file_label = file_input_div.appendChild(document.createElement('span'));
	file_label.innerHTML = "Drag the parent directory of a Spine skeleton JSON file to the file input.";
	file_input.addEventListener('change', function (e)
	{
		var input_files = e.target.files;

		// shim the relativePath
		for (var idx = 0, len = input_files.length; idx < len; ++idx)
		{
			var input_file = input_files[idx];
			input_file.webkitRelativePath = input_file.webkitRelativePath || null;
			input_file.mozRelativePath = input_file.mozRelativePath || null;
			input_file.relativePath = input_file.relativePath || input_file.webkitRelativePath || input_file.mozRelativePath || input_file.name;
		}

		var skeleton_files = [];

		// look for Spine skeleton JSON files
		// match: ".*-skeleton.json$"
		for (var input_file_idx = 0, input_files_len = input_files.length; input_file_idx < input_files_len; ++input_file_idx)
		{
			var input_file = input_files[input_file_idx];

			if (input_file.name.toLowerCase().match("^.*-skeleton.json$"))
			{
				skeleton_files.push(input_file);
			}
		}

		// load first skeleton
		// TODO: load all skeletons
		//for (var skeleton_file_idx = 0, skeleton_files_len = skeleton_files.length; skeleton_file_idx < skeleton_files_len; ++skeleton_file_idx)
		if (skeleton_files.length > 0)
		{
			//var skeleton_file = skeleton_files[skeleton_file_idx];
			var skeleton_file = skeleton_files[0];

			// look for Spine animation JSON files for this Spine skeleton
			// get basename: basename-skeleton.json
			// match: "^basename-*.json$"

			var match = skeleton_file.name.match(/^(\w*)-skeleton.json$/i);
			var basename = match && match[1];

			var animation_files = [];

			for (var input_file_idx = 0, input_files_len = input_files.length; input_file_idx < input_files_len; ++input_file_idx)
			{
				var input_file = input_files[input_file_idx];

				if (input_file == skeleton_file) { continue; }

				if (input_file.name.toLowerCase().match("^" + basename + "-.*.json$"))
				{
					animation_files.push(input_file);
				}
			}

			var data = new spine.data();
			var skeleton = data.m_skeleton;

			skeleton_info_div.innerHTML = "Loading...";
			main.load_skeleton_from_input_file(skeleton, skeleton_file, input_files, (function (skeleton) { return function ()
			{
				skeleton_info_div.innerHTML = "Skeleton Name: " + skeleton_file.relativePath;

				pose = new spine.pose(data);
				set_camera(pose);

				// load all animations
				for (var animation_file_idx = 0, animation_files_len = animation_files.length; animation_file_idx < animation_files_len; ++animation_file_idx)
				{
					var animation_file = animation_files[animation_file_idx];

					var animation = new spine.animation();
					animation.name = animation_file.relativePath;

					if (animation_file_idx == 0) { pose.setAnim(animation.name); }

					animation_info_div.innerHTML = "Loading...";
					main.load_animation_from_input_file(animation, animation_file, input_files, (function (animation) { return function ()
					{
						animation_info_div.innerHTML = "Animation Name: " + animation_file.relativePath;

						if (animation.name)
						{
							data.m_animations[animation.name] = animation;
						}
						set_camera(pose);
					}
					})(animation));
				}
			}
			})(skeleton));
		}
	},
	false);

	var cursor_x = 0;
	var cursor_y = 0;
	var cursor_down = false;
	var cursor_down_x = 0;
	var cursor_down_y = 0;

	canvas_div.addEventListener('mousedown', function (e)
	{
		cursor_down = true;
		cursor_down_x = e.clientX;
		cursor_down_y = e.clientY;
	},
	false);
	canvas_div.addEventListener('mouseup', function (e)
	{
		cursor_down = false;
	},
	false);
	canvas_div.addEventListener('mousemove', function (e)
	{
		cursor_x = e.clientX;
		cursor_y = e.clientY;

		if (cursor_down)
		{
			var dx = cursor_x - cursor_down_x;
			var dy = cursor_y - cursor_down_y;

			dy = -dy;

			dx *= camera_scale;
			dy *= camera_scale;

			var rad = camera_angle * Math.PI / 180;
			var rc = Math.cos(rad), rs = Math.sin(rad);
			var tx = dx, ty = dy;
			dx = tx*rc - ty*rs;
			dy = tx*rs + ty*rc;

			camera_x -= dx;
			camera_y -= dy;

			cursor_down_x = cursor_x;
			cursor_down_y = cursor_y;
		}
	},
	false);
	canvas_div.addEventListener('mousewheel', function (e)
	{
		if (e.wheelDelta < 0)
		{
			camera_scale *= 1.1;
			camera_scale = Math.min(camera_scale, 100);
		}
		else if (e.wheelDelta > 0)
		{
			camera_scale *= 0.9;
			camera_scale = Math.max(camera_scale, 0.01);
		}
	},
	false);

	var canvas_2d_div = canvas_div.appendChild(document.createElement('div'));
	canvas_2d_div.style.display = 'inline-block';
	var label = canvas_2d_div.appendChild(document.createElement('div'));
	label.innerHTML = "2D Canvas";
	var canvas_2d = /** @type {HTMLCanvasElement} */ (canvas_2d_div.appendChild(document.createElement('canvas')));
	canvas_2d.style.display = 'inline-block';
	canvas_2d.style.border = '1px solid black';
	canvas_2d.width = canvas_w;
	canvas_2d.height = canvas_h;
	var view_2d = new main.view_2d(canvas_2d);

	var time_scale = 1.0;

	var slider_label = control_div.appendChild(document.createElement('span'));
	var slider = control_div.appendChild(document.createElement('input'));
	var slider_value = control_div.appendChild(document.createElement('span'));
	slider_label.innerHTML = "Time Scale: ";
	slider.type = 'range';
	slider.min = -2.0;
	slider.max = 2.0;
	slider.step = 0.01;
	slider.value = time_scale;
	slider_value.innerHTML = time_scale;
	slider.addEventListener('change', function (e)
	{
		time_scale = parseFloat(e.target.value);
		slider_value.innerHTML = time_scale.toFixed(2);
	},
	false);

	var debug_draw = false;

	var checkbox = control_div.appendChild(document.createElement('input'));
	var checkbox_label = control_div.appendChild(document.createElement('span'));
	checkbox.type = 'checkbox';
	checkbox.checked = debug_draw;
	checkbox_label.innerHTML = "Debug Draw";
	checkbox.addEventListener('change', function (e)
	{
		debug_draw = e.target.checked;
	},
	false);

	var update = function (tick)
	{
		var anim_time = tick.elapsed_time * time_scale;

		if (pose.getNumAnims() > 1)
		{
			if ((pose.getTime() + anim_time) < 0)
			{
				pose.setPrevAnim();
				animation_info_div.innerHTML = "Animation Name: " + pose.getAnimName();
			}
			if ((pose.getTime() + anim_time) >= pose.getAnimLength())
			{
				pose.setNextAnim();
				animation_info_div.innerHTML = "Animation Name: " + pose.getAnimName();
			}
		}

		pose.update(anim_time);
	}

	var draw_2d = function ()
	{
		var ctx_2d = view_2d.ctx_2d;

		if (ctx_2d)
		{
			ctx_2d.clearRect(0, 0, ctx_2d.canvas.width, ctx_2d.canvas.height);

			ctx_2d.save();

				// 0,0 at center, x right, y up
				ctx_2d.translate(ctx_2d.canvas.width / 2, ctx_2d.canvas.height / 2);
				ctx_2d.scale(1, -1);

				// apply camera
				ctx_2d.scale(1 / camera_scale, 1 / camera_scale);
				ctx_2d.rotate(-camera_angle * Math.PI / 180);
				ctx_2d.translate(-camera_x, -camera_y);

				if (debug_draw)
				{
					view_2d.debug_draw_skeleton_2d(pose);

					view_2d.debug_draw_pose_2d(pose);

					var extent = main.get_pose_extent(pose);
					ctx_2d.strokeStyle = 'blue';
					ctx_2d.strokeRect(
						extent.min.x, extent.min.y,
						extent.max.x - extent.min.x,
						extent.max.y - extent.min.y);
				}
				else
				{
					view_2d.draw_pose_2d(pose);
				}

			ctx_2d.restore();

			//if (debug_draw) { main.test_draw_bezier_curves(tick, ctx_2d); }
		}
	}

	var tick = new Object();
	tick.frame = 0;
	tick.time = 0;
	tick.time_last = 0;
	tick.elapsed_time = 0;

	var loop = function (time)
	{
		window.requestAnimationFrame(loop, null);

		++tick.frame;
		tick.time = time;

		tick.elapsed_time = Math.min(tick.time - tick.time_last, 50);

		update(tick);

		tick.time_last = time;

		draw_2d();
	}

	loop(tick.time_last);
}

main.load_data_from_url = function (data, url, callback)
{
	var skeleton = data.m_skeleton;

	skeleton.files = {};

	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.addEventListener('readystatechange', function (e)
	{
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304)
		{
			return;
		}

		data.load(JSON.parse(e.target.responseText));
		/* data.load(goog.global.JSON.parse(e.target.responseText)); */

		callback();

		var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);
		if (skel_skin) for (var slot_i in skel_skin.skin_slots)
		{
			var skin_slot = skel_skin.skin_slots[slot_i];
			if (!skin_slot) { continue; }
			for (var skin_attachment_i in skin_slot.skin_attachments)
			{
				var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];

				var name = skin_attachment.name || skin_attachment_i;

				var file = skeleton.files && skeleton.files[name];
				if (!file)
				{
					var base_path = url.slice(0, url.lastIndexOf('/'));

					//window.console.log("load image: " + base_path + "/" + name + ".png");
					file = skeleton.files[name] = {};
					file.width = skin_attachment.width || 0;
					file.height = skin_attachment.height || 0;
					var image = file.image = new Image();
					image.hidden = true;
					image.addEventListener('load', (function (file) { return function (e)
					{
						file.width = file.width || e.target.width;
						file.height = file.height || e.target.height;
						e.target.hidden = false;
					}
					})(file), false);
					image.addEventListener('error', function (e) {}, false);
					image.addEventListener('abort', function (e) {}, false);
					image.src = base_path + "/" + name + ".png";
				}
			}
		}
	},
	false);
	req.send();

	return skeleton;
}

main.load_skeleton_from_url = function (skeleton, url, callback)
{
	skeleton.files = {};

	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.addEventListener('readystatechange', function (e)
	{
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304)
		{
			return;
		}

		skeleton.load(goog.global.JSON.parse(e.target.responseText));

		callback();

		var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);
		if (skel_skin) for (var slot_i in skel_skin.skin_slots)
		{
			var skin_slot = skel_skin.skin_slots[slot_i];
			if (!skin_slot) { continue; }
			for (var skin_attachment_i in skin_slot.skin_attachments)
			{
				var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];

				var name = skin_attachment.name || skin_attachment_i;

				var file = skeleton.files && skeleton.files[name];
				if (!file)
				{
					var base_path = url.slice(0, url.lastIndexOf('/'));

					//window.console.log("load image: " + base_path + "/" + name + ".png");
					file = skeleton.files[name] = {};
					file.width = skin_attachment.width || 0;
					file.height = skin_attachment.height || 0;
					var image = file.image = new Image();
					image.hidden = true;
					image.addEventListener('load', (function (file) { return function (e)
					{
						file.width = file.width || e.target.width;
						file.height = file.height || e.target.height;
						e.target.hidden = false;
					}
					})(file), false);
					image.addEventListener('error', function (e) {}, false);
					image.addEventListener('abort', function (e) {}, false);
					image.src = base_path + "/" + name + ".png";
				}
			}
		}
	},
	false);
	req.send();

	return skeleton;
}

main.load_animation_from_url = function (animation, url, callback)
{
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.addEventListener('readystatechange', function (e)
	{
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304)
		{
			return;
		}

		animation.load(goog.global.JSON.parse(e.target.responseText));

		callback();
	},
	false);
	req.send();

	return animation;
}

main.load_skeleton_from_input_file = function (skeleton, skeleton_file, input_files, callback)
{
	skeleton.files = {};

	var skeleton_file_reader = new FileReader();
	skeleton_file_reader.addEventListener('load', function (e)
	{
		// load Spine skeleton JSON file
		skeleton.load(goog.global.JSON.parse(e.target.result));

		callback();

		// load images
		var find_file = function (name)
		{
			var name = name.toLowerCase() + '$'; // match at end of line only
			for (var idx = 0, len = input_files.length; idx < len; ++idx)
			{
				var input_file = input_files[idx];
				if (input_file.relativePath.toLowerCase().match(name))
				{
					return input_file;
				}
			}
			return null;
		}

		var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);
		if (skel_skin) for (var slot_i in skel_skin.skin_slots)
		{
			var skin_slot = skel_skin.skin_slots[slot_i];
			if (!skin_slot) { continue; }
			for (var skin_attachment_i in skin_slot.skin_attachments)
			{
				var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];
				var name = skin_attachment.name || skin_attachment_i;
				var file = skeleton.files && skeleton.files[name];
				if (!file)
				{
					var image_file = find_file(name + ".png");
					if (image_file)
					{
						file = skeleton.files[name] = {};
						var image_file_reader = new FileReader();
						image_file_reader.addEventListener('load', (function (file) { return function (e)
						{
							var image = file.image = new Image();
							image.hidden = true;
							image.addEventListener('load', function (e)
							{
								file.width = file.width || e.target.width;
								file.height = file.height || e.target.height;
								e.target.hidden = false;
							},
							false);
							image.addEventListener('error', function (e) {}, false);
							image.addEventListener('abort', function (e) {}, false);
							image.src = e.target.result;
						}
						})(file), false);
						image_file_reader.readAsDataURL(image_file);
					}
				}
			}
		}
	},
	false);
	skeleton_file_reader.readAsText(skeleton_file);
}

main.load_animation_from_input_file = function (animation, animation_file, input_files, callback)
{
	var animation_file_reader = new FileReader();
	animation_file_reader.addEventListener('load', function (e)
	{
		animation.load(goog.global.JSON.parse(e.target.result));

		callback();
	},
	false);
	animation_file_reader.readAsText(animation_file);
}

/**
 * @return {Object}
 * @param {spine.pose} pose
 * @param {Object=} extent
 */
main.get_pose_extent = function (pose, extent)
{
	extent = extent || { min: { x: 1, y: 1 }, max: { x: -1, y: -1 } };

	var data = pose.m_data;
	if (!data) { return extent; }
	var skeleton = data.m_skeleton;
	if (!skeleton) { return extent; }

	var bound = function (v)
	{
		if (extent.min.x > extent.max.x)
		{
			extent.min.x = extent.max.x = v.x;
			extent.min.y = extent.max.y = v.y;
		}
		else
		{
			extent.min.x = Math.min(extent.min.x, v.x);
			extent.max.x = Math.max(extent.max.x, v.x);
			extent.min.y = Math.min(extent.min.y, v.y);
			extent.max.y = Math.max(extent.max.y, v.y);
		}
	}

	var mtx = new fo.m3x2();
	var ll = new fo.v2(-1, -1);
	var lr = new fo.v2( 1, -1);
	var ul = new fo.v2(-1,  1);
	var ur = new fo.v2( 1,  1);
	var tv = new fo.v2(0, 0);

	pose.strike();

	var skel_bones = pose.m_tweened_skel_bones;
	var skel_slots = pose.m_tweened_skel_slots;

	var mtx = new fo.m3x2();

	var apply_skel_bone_transform = function (skel_bone)
	{
		if (skel_bone.parent)
		{
			apply_skel_bone_transform(skel_bones[skel_bone.parent]);
		}
		mtx.selfTranslate(skel_bone.x, skel_bone.y);
		mtx.selfRotateDegrees(skel_bone.rotation);
		mtx.selfScale(skel_bone.scaleY, skel_bone.scaleY);
	}

	var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);

	if (skel_skin) for (var slot_i in skel_slots)
	{
		var skel_slot = skel_slots[slot_i];
		var skin_attachment_i = skel_slot.attachment;
		if (!skin_attachment_i) { continue; }
		var skin_slot = skel_skin.skin_slots[slot_i];
		if (!skin_slot) { continue; }

		var skel_bone = skel_bones[skel_slot.bone];
		var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];

		mtx.makeIdentity();

		apply_skel_bone_transform(skel_bone);

		mtx.selfTranslate(skin_attachment.x, skin_attachment.y);
		mtx.selfRotateDegrees(skin_attachment.rotation);
		mtx.selfScale(skin_attachment.scaleX, skin_attachment.scaleY);

		var name = skin_attachment.name || skin_attachment_i;

		var file = skeleton.files && skeleton.files[name];

		if (file && file.image && !file.image.hidden)
		{
			var w = file.width;
			var h = file.height;
			mtx.selfScale(w/2, h/2);
		}
		else
		{
			var w = skin_attachment.width;
			var h = skin_attachment.height;
			mtx.selfScale(w/2, h/2);
		}

		bound(mtx.applyVector(ul, tv));
		bound(mtx.applyVector(ur, tv));
		bound(mtx.applyVector(lr, tv));
		bound(mtx.applyVector(ll, tv));
	}

	return extent;
}

/**
 * @constructor
 * @param {HTMLCanvasElement} canvas_2d
 */
main.view_2d = function (canvas_2d)
{
	this.ctx_2d = canvas_2d.getContext('2d');
}

/**
 * @return {void}
 * @param {spine.pose} pose
 */
main.view_2d.prototype.debug_draw_skeleton_2d = function (pose)
{
	this.draw_skeleton_2d(pose);

	var data = pose.m_data;
	if (!data) { return; }
	var skeleton = data.m_skeleton;
	if (!skeleton) { return; }

	var ctx_2d = this.ctx_2d;

	var skel_bones = skeleton.skel_bones;
	var skel_slots = skeleton.skel_slots;

	var apply_skel_bone_transform = function (skel_bone)
	{
		if (skel_bone.parent)
		{
			apply_skel_bone_transform(skel_bones[skel_bone.parent]);
		}
		ctx_2d.translate(skel_bone.x, skel_bone.y);
		ctx_2d.rotate(skel_bone.rotation * Math.PI / 180);
		ctx_2d.scale(skel_bone.scaleX, skel_bone.scaleY);
	}

	for (var bone_i in skel_bones)
	{
		var skel_bone = skel_bones[bone_i];
		var length = skel_bone.length || 0;

		ctx_2d.save();

		apply_skel_bone_transform(skel_bone);

		ctx_2d.beginPath();
		ctx_2d.arc(0, 0, 2, 0, 2*Math.PI, false);
		if (length > 0)
		{
			ctx_2d.moveTo(0, -2);
			ctx_2d.lineTo(length, 0);
			ctx_2d.lineTo(0, 2);
		}
		else
		{
			ctx_2d.moveTo(-2, 0); ctx_2d.lineTo(-4, 0);
			ctx_2d.moveTo( 2, 0); ctx_2d.lineTo( 4, 0);
			ctx_2d.moveTo(0, -2); ctx_2d.lineTo(0, -4);
			ctx_2d.moveTo(0,  2); ctx_2d.lineTo(0,  4);
		}
		ctx_2d.strokeStyle = 'rgba(200,200,200,0.75)';
		ctx_2d.stroke();

		ctx_2d.scale(0.5, -0.5);
		ctx_2d.fillText(bone_i, 0, 0);

		ctx_2d.restore();
	}
}

/**
 * @return {void}
 * @param {spine.pose} pose
 */
main.view_2d.prototype.draw_skeleton_2d = function (pose)
{
	var data = pose.m_data;
	if (!data) { return; }
	var skeleton = data.m_skeleton;
	if (!skeleton) { return; }

	var ctx_2d = this.ctx_2d;

	var skel_bones = skeleton.skel_bones;
	var skel_slots = skeleton.skel_slots;

	var apply_skel_bone_transform = function (skel_bone)
	{
		if (skel_bone.parent)
		{
			apply_skel_bone_transform(skel_bones[skel_bone.parent]);
		}
		ctx_2d.translate(skel_bone.x, skel_bone.y);
		ctx_2d.rotate(skel_bone.rotation * Math.PI / 180);
		ctx_2d.scale(skel_bone.scaleX, skel_bone.scaleY);
	}

	var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);

	if (skel_skin) for (var slot_i in skel_slots)
	{
		var skel_slot = skel_slots[slot_i];
		var skin_attachment_i = skel_slot.attachment;
		if (!skin_attachment_i) { continue; }
		var skin_slot = skel_skin.skin_slots[slot_i];
		if (!skin_slot) { continue; }

		var skel_bone = skel_bones[skel_slot.bone];
		var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];

		ctx_2d.save();

		apply_skel_bone_transform(skel_bone);

		ctx_2d.translate(skin_attachment.x, skin_attachment.y);
		ctx_2d.rotate(skin_attachment.rotation * Math.PI / 180);
		ctx_2d.scale(skin_attachment.scaleX, skin_attachment.scaleY);

		ctx_2d.globalAlpha = skel_slot.color.a;

		var name = skin_attachment.name || skin_attachment_i;

		var file = skeleton.files && skeleton.files[name];

		if (file && file.image && !file.image.hidden)
		{
			ctx_2d.scale(1, -1);
			var w = file.width;
			var h = file.height;
			ctx_2d.drawImage(file.image, -w/2, -h/2, w, h);
		}
		else
		{
			var w = skin_attachment.width;
			var h = skin_attachment.height;
			ctx_2d.fillStyle = 'rgba(127,127,127,0.5)';
			ctx_2d.fillRect(-w/2, -h/2, w, h);
		}

		ctx_2d.restore();
	}
}

/**
 * @return {void}
 * @param {spine.pose} pose
 */
main.view_2d.prototype.debug_draw_pose_2d = function (pose)
{
	var data = pose.m_data;
	if (!data) { return; }
	var skeleton = data.m_skeleton;
	if (!skeleton) { return; }

	pose.strike();

	this.draw_pose_2d(pose);

	var ctx_2d = this.ctx_2d;

	var skel_bones = pose.m_tweened_skel_bones;
	var skel_slots = pose.m_tweened_skel_slots;

	var apply_skel_bone_transform = function (skel_bone)
	{
		if (skel_bone.parent)
		{
			apply_skel_bone_transform(skel_bones[skel_bone.parent]);
		}
		ctx_2d.translate(skel_bone.x, skel_bone.y);
		ctx_2d.rotate(skel_bone.rotation * Math.PI / 180);
		ctx_2d.scale(skel_bone.scaleX, skel_bone.scaleY);
	}

	for (var bone_i in skel_bones)
	{
		var skel_bone = skel_bones[bone_i];
		var length = skel_bone.length || 0;

		ctx_2d.save();

		apply_skel_bone_transform(skel_bone);

		ctx_2d.beginPath();
		ctx_2d.arc(0, 0, 2, 0, 2*Math.PI, false);
		if (length > 0)
		{
			ctx_2d.moveTo(0, -2);
			ctx_2d.lineTo(length, 0);
			ctx_2d.lineTo(0, 2);
		}
		else
		{
			ctx_2d.moveTo(-2, 0); ctx_2d.lineTo(-4, 0);
			ctx_2d.moveTo( 2, 0); ctx_2d.lineTo( 4, 0);
			ctx_2d.moveTo(0, -2); ctx_2d.lineTo(0, -4);
			ctx_2d.moveTo(0,  2); ctx_2d.lineTo(0,  4);
		}
		ctx_2d.strokeStyle = 'rgba(200,200,200,0.75)';
		ctx_2d.stroke();

		ctx_2d.scale(0.5, -0.5);
		ctx_2d.fillText(bone_i, 0, 0);

		ctx_2d.restore();
	}
}

/**
 * @return {void}
 * @param {spine.pose} pose
 */
main.view_2d.prototype.draw_pose_2d = function (pose)
{
	var data = pose.m_data;
	if (!data) { return; }
	var skeleton = data.m_skeleton;
	if (!skeleton) { return; }

	pose.strike();

	var ctx_2d = this.ctx_2d;

	var skel_bones = pose.m_tweened_skel_bones;
	var skel_slots = pose.m_tweened_skel_slots;

	var apply_skel_bone_transform = function (skel_bone)
	{
		if (skel_bone.parent)
		{
			apply_skel_bone_transform(skel_bones[skel_bone.parent]);
		}
		ctx_2d.translate(skel_bone.x, skel_bone.y);
		ctx_2d.rotate(skel_bone.rotation * Math.PI / 180);
		ctx_2d.scale(skel_bone.scaleX, skel_bone.scaleY);
	}

	var skel_skin = (skeleton.current_skin_i != null)?(skeleton.skins[skeleton.current_skin_i]):(null);

	if (skel_skin) for (var slot_i in skel_slots)
	{
		var skel_slot = skel_slots[slot_i];
		var skin_attachment_i = skel_slot.attachment;
		if (!skin_attachment_i) { continue; }
		var skin_slot = skel_skin.skin_slots[slot_i];
		if (!skin_slot) { continue; }

		var skel_bone = skel_bones[skel_slot.bone];
		var skin_attachment = skin_slot.skin_attachments[skin_attachment_i];

		ctx_2d.save();

		apply_skel_bone_transform(skel_bone);

		ctx_2d.translate(skin_attachment.x, skin_attachment.y);
		ctx_2d.rotate(skin_attachment.rotation * Math.PI / 180);
		ctx_2d.scale(skin_attachment.scaleX, skin_attachment.scaleY);

		ctx_2d.globalAlpha = skel_slot.color.a;

		var name = skin_attachment.name || skin_attachment_i;

		var file = skeleton.files && skeleton.files[name];

		if (file && file.image && !file.image.hidden)
		{
			ctx_2d.scale(1, -1);
			var w = file.width;
			var h = file.height;
			ctx_2d.drawImage(file.image, -w/2, -h/2, w, h);
		}
		else
		{
			var w = skin_attachment.width;
			var h = skin_attachment.height;
			ctx_2d.fillStyle = 'rgba(127,127,127,0.5)';
			ctx_2d.fillRect(-w/2, -h/2, w, h);
		}

		ctx_2d.restore();
	}
}

/**
 * @return {void}
 * @param {Float32Array} dst
 * @param {fo.m3x2} src
 */
main.set_a16_from_m3x2 = function (dst, src)
{
	dst[ 0] = src.a_x; dst[ 1] = src.a_y; dst[ 2] = 0; dst[ 3] = 0; // col 0
	dst[ 4] = src.b_x; dst[ 5] = src.b_y; dst[ 6] = 0; dst[ 7] = 0; // col 1
	dst[ 8] = 0;       dst[ 9] = 0;       dst[10] = 1; dst[11] = 0; // col 2
	dst[12] = src.c_x; dst[13] = src.c_y; dst[14] = 0; dst[15] = 1; // col 3
}

main.test_draw_bezier_curves = function (tick, ctx_2d)
{
	ctx_2d.save();

	ctx_2d.translate(0, ctx_2d.canvas.height);
	ctx_2d.scale(1, -1);
	ctx_2d.translate(ctx_2d.canvas.width/4, ctx_2d.canvas.height/4);
	ctx_2d.scale(0.5, 0.5);

	ctx_2d.lineWidth = 4;

	ctx_2d.strokeStyle = 'black';
	ctx_2d.strokeRect(0, 0, ctx_2d.canvas.width, ctx_2d.canvas.height);

	var x1 = Math.cos(tick.time / 1000);
	var y1 = Math.sin(tick.time / 1000);
	x1 = Math.min(Math.max(x1, 0), 1);

	var x2 = 1-Math.cos(2*tick.time / 1000);
	var y2 = 1-Math.sin(2*tick.time / 1000);
	x2 = Math.min(Math.max(x2, 0), 1);

	var c1 = spine.step_bezier_curve(x1, y1, x2, y2);
	var c2 = spine.bezier_curve(x1, y1, x2, y2, 1e-6);

	var step = 0.01;

	ctx_2d.beginPath();
	ctx_2d.moveTo(0,0);
	for (var i = 0; i < 1+step; i += step)
	{
		var x = i * ctx_2d.canvas.width;
		var y = c1(i) * ctx_2d.canvas.height;
		ctx_2d.lineTo(x, y);
	}
	ctx_2d.strokeStyle = 'red';
	ctx_2d.stroke();

	ctx_2d.beginPath();
	ctx_2d.moveTo(0,0);
	for (var i = 0; i < 1+step; i += step)
	{
		var x = i * ctx_2d.canvas.width;
		var y = c2(i) * ctx_2d.canvas.height;
		ctx_2d.lineTo(x, y);
	}
	ctx_2d.strokeStyle = 'green';
	ctx_2d.stroke();

	ctx_2d.beginPath();
	ctx_2d.moveTo(0,0);
	ctx_2d.lineTo(x1 * ctx_2d.canvas.width, y1 * ctx_2d.canvas.height);
	ctx_2d.arc(x1 * ctx_2d.canvas.width, y1 * ctx_2d.canvas.height, 10, 0, 2*Math.PI);
	ctx_2d.strokeStyle = 'blue';
	ctx_2d.stroke();

	ctx_2d.beginPath();
	ctx_2d.moveTo(ctx_2d.canvas.width, ctx_2d.canvas.height);
	ctx_2d.lineTo(x2 * ctx_2d.canvas.width, y2 * ctx_2d.canvas.height);
	ctx_2d.arc(x2 * ctx_2d.canvas.width, y2 * ctx_2d.canvas.height, 10, 0, 2*Math.PI);
	ctx_2d.strokeStyle = 'blue';
	ctx_2d.stroke();

	var x = 0.5 + 0.5 * Math.cos(3*tick.time / 1000);
	var y1 = c1(x);
	var y2 = c2(x);
	ctx_2d.beginPath();
	ctx_2d.moveTo(x * ctx_2d.canvas.width, 0);
	ctx_2d.lineTo(x * ctx_2d.canvas.width, y1 * ctx_2d.canvas.height);
	ctx_2d.arc(x * ctx_2d.canvas.width, y1 * ctx_2d.canvas.height, 10, 0, 2*Math.PI);
	ctx_2d.strokeStyle = 'blue';
	ctx_2d.stroke();

	ctx_2d.beginPath();
	ctx_2d.moveTo(x * ctx_2d.canvas.width, 0);
	ctx_2d.lineTo(x * ctx_2d.canvas.width, y2 * ctx_2d.canvas.height);
	ctx_2d.strokeStyle = 'blue';
	ctx_2d.stroke();

	ctx_2d.restore();
}

