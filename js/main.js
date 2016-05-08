/**
 * Created by CXJ on 2016/4/21.
 */
$(function(){
    //alert('a');
    var flg_click = true;  //控制点击事件
    var $wrap_images = $('#wrap_images');
    var $thumbs	= $wrap_images.children('div');
    var $thumb_imgs = $thumbs.find('img');  //所有图片
    var nmb_thumbs	= $thumbs.length; //图片数量
    var per_line= 6; //每行图片张数
    var per_col= Math.ceil(nmb_thumbs/per_line)//多少列
    var mode= 'grid';//网格状或者单张状

    //所有图片加载前
    var loaded = 0;
    $thumb_imgs.each(function(){
        var $this = $(this);
        $('<img/>').load(function(){
            ++loaded;
            //console.log(loaded);
            if(loaded == nmb_thumbs*2)
                disperse();
        }).attr('src',$this.attr('src'));
        $('<img/>').load(function(){
            ++loaded;
            //console.log(loaded)
            if(loaded == nmb_thumbs*2)
                disperse();
        }).attr('src',$this.attr('src').replace('/thumbs',''));
    });

    //散步图片在一个网状结构上
    function disperse(){
        if(!flg_click) return;
        setflag();
        mode = 'grid';
        var spaces_w = $(window).width()/(per_line + 1);  //第一张图片中心点离左边界的距离
        var spaces_h = $(window).height()/(per_col + 1);  //第一张图片中心点离上边界的距离
        //console.log(spaces_w);
        //console.log(spaces_h);
        $thumbs.each(function(i){
            var $thumb 	= $(this);
            var left = spaces_w*((i%per_line)+1) - $thumb.width()/2;  //左边距
            var top	 = spaces_h*(Math.ceil((i+1)/per_line)) - $thumb.height()/2;   //上边距
            var r = Math.floor(Math.random()*41)-20;
            var param = {
                'left'		: left + 'px',
                'top'		: top + 'px',
                'rotate'	: r + 'deg'
            };
            /*接下来用动画的形式的图片显示在最终位置
              使用fadein，并且固定咋一个115X115的容器上*/
            $thumb.stop()
                .animate(param,700,function(){
                    if(i==nmb_thumbs-1)
                        setflag();
                })
                .find('img')
                .fadeIn(700,function(){
                    $thumb.css({
                        'background-image'	: 'none'  //一直保持没有背景，不管点击多少次
                    });
                    $(this).animate({
                        'width'		: '115px',
                        'height'	: '115px',
                        'marginTop'	: '5px',
                        'marginLeft': '5px'
                    },150);
                });
        });
    }
    function setflag(){
        flg_click = !flg_click
    }

    //console.log($thumbs)
    $thumbs.bind('click',function(){
        //console.log(flg_click)
        if(!flg_click) return;
        setflag();

        var $this = $(this);
        //console.log('$this');

        if(mode	== 'grid'){
            mode = 'single';
			//大图的src
            var image_src	= $this.find('img').attr('src').replace('/thumbs','');
            //console.log(image_src);

            $thumbs.each(function(i){
                var $thumb 	= $(this);
                var $image 	= $thumb.find('img');
                $image.stop().animate({
                    'width'		: '100%',
                    'height'	: '100%',
                    'marginTop'	: '0px',
                    'marginLeft': '0px'
                },150,function(){
				//计算大图的尺寸
				    var f_w	= per_line * 125;
                    var f_h	= per_col * 125;
                    var f_l = $(window).width()/2 - f_w/2
                    var f_t = $(window).height()/2 - f_h/2

                    var param = {
                        'rotate': '0deg',
                        'left'	: f_l + (i%per_line)*125 + 'px',
                        'top'	: f_t + Math.floor(i/per_line)*125 + 'px'
                    };
                    $thumb.css({
                        'background-image'	: 'url('+image_src+')'
                    }).stop()
                        .animate(param,1200,function(){
                            if(i==nmb_thumbs-1){
                                setflag();
                            }
                        });
                    $image.fadeOut(700);
                });
            });
        }
        else{
            setflag();
			//散布图片
            disperse();
        }
    });

    //窗口有变化时就把图片变成散布状
    $(window).resize(function(){
        disperse();
    });
})