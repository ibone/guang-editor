(function(){
    var size = [
        {
            val : 1,
            alt : '小号字体',
            px  : '12px'
        }, {
            val : 2,
            alt : '标准字体',
            px  : '14px'
        }, {
            val : 3,
            alt : '大号字体',
            px  : '16px'
        }, {
            val : 4,
            alt : '特大字体',
            px  : '18px'
        }
    ];
    var config = {
        'size':size
    }
    $.ubb_editor.plugin('btn_size',config,function(editor){
        var size = editor.get_plugin_config('btn_size').size;
        var size_map = {};
        for (var i = 0; i < size.length; i++) {
            size_map[size[i].val+''] = size[i].px;
        }
        editor.add_button(
            {
                name : 'size',
                show_panel : function (editor) {
                    if (editor.find('.ubb_size_panel').length === 0) {
                        var html = '<div class="ubb_size_panel">';
                        for (var i = 0; i < size.length; i++) {
                            html += '<a data-onclick="exec" data-name="size" data-size="'+size[i].val+'" style="font-size:'+ size[i].px +'" href="javascript:;" title="'+size[i].alt+'" unselectable="on">'+size[i].alt+'</a>';
                        }
                        html += '</div>';
                        editor.add_panel(html);
                    } else {
                        editor.toggle_panel('.ubb_size_panel');
                    }
                },
                onselected : function (editor,selection_container) {
                    var style_size = $(selection_container).css('font-size');
                    var default_alt = '小号字体';
                    if (style_size) {
                        $(size).each(function(){
                            if(this.px === style_size){
                                default_alt = this.alt;
                                return false;
                            }
                        });
                    }
                    editor.find('.font-size a').text(default_alt);
                },
                html :  '<div class="font-btns font-size">'+
                            '<a href="javascript:;" data-onclick="show_panel" data-name="size" title="字号" unselectable="on">标准字体</a>'+
                        '</div>',
                exec : function (editor, target_button) {
                    var self = this;
                    var change_font = function() {
                        var fonts = $(editor.document).find("font,span"),
                            $font,px,size;
                        for (var i = 0, len = fonts.length; i < len; i++) {
                            $font = fonts.eq(i);
                            size = $font.attr('size');
                            px = size_map[size];
                            if (px) {
                                $font.removeAttr('size').css('font-size',px).attr(self.ubb_attr,size);
                            }
                        }
                    };
                    var $button = $(target_button);
                    editor.exec_command('fontsize', $button.data("size"));
                    change_font();
                },
                encode_ubb : function(attr_value){
                    if(attr_value){
                        return {
                            node_name : 'font',
                            node_attr : attr_value.replace('#','')
                        };
                    }else{
                        return {};
                    }
                },
                decode_ubb : function(editor){
                    var ubb_map = {};
                    for (var i = 0; i < size.length; i++) {
                        ubb_map['[font' + size[i].val + ']'] = '<font '+ this.ubb_attr +'="'+ size[i].val +'" style="font-size:' + size[i].px + '">';
                    }
                    ubb_map['[/font]'] = '</font>';
                    return ubb_map;
                },
                allow_tag : {
                    'font'  : true,
                    'span' : true
                },
                ubb_attr : 'ubb-size'
            }
        );
    });
})();