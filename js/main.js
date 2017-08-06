$(function()
{

    $('.main.menu').visibility({
        type: 'fixed'
    });

    $("#toggle_sidebar").on('click', function()
    {
        $('.ui.sidebar').sidebar('toggle');
    });

    $("#load_embed").on('click', function()
    {
        //<a href="http://91.121.173.74/reader/?book=[TLS]TLD76.epub" data-bibi="embed" data-bibi-style="width: 100%; height: 100%;">My Great Book Title</a><script src="http://91.121.173.74/reader/i/script/bibi.js"></script>
        $('.embed-reader').empty();

        ebookpath = '[TLS]TLD76.epub'
        $('.embed-reader').html(
            '<a href="http://91.121.173.74/reader/bib/i/?book='+ ebookpath +'" data-bibi="embed" data-bibi-style="">OUI</a><script src="http://91.121.173.74/reader/bib/i.js"></script>' );

    });


    var fileTreeJson = null;
    var selectedSerie = null;
    var selectedChap = null;
    var prevChap = null;
    var nextChap = null;
    var readerEnabled = false;
    var baseUrl = 'bookshelf/';

    /**
     * Functions
     */
    function changeReaderSource()
    {
        var url;
        url = 'bib/i/?book='+selectedSerie+'/'+selectedChap;
        var epubUrl = encodeURI(url);
        $("#embedded_reader").attr('src', epubUrl);

        readerEnabled = true;

        detectPrevChapter();
        detectNextChapter();
    }

    function generateChapterSelect()
    {
        if(!$("#series_select").val())
        {
            return false;
        }
        var serie = $("#series_select").val();
        var chapterSerie = fileTreeJson[serie];
        $('#chapter_select').empty();
        $.each(chapterSerie, function (index, value) {
            $option = $('<option>');
            $option.attr('value', index);
            $option.text(index);
            $('#chapter_select').append($option);
        });
    }

    function generateSeriesSelect()
    {

        if(!fileTreeJson)
        {
            return false;
        }

        $('#series_select').empty();

        $.each(fileTreeJson, function (index, value) {
            $option = $('<option>');
            $option.attr('value', index);
            $option.text(index);
            $('#series_select').append($option);
        });

        generateChapterSelect();
    }

    function detectNextChapter()
    {
        nextChap = null
        var actualChap = null;
        var actualChapFound = false;
        $.each(fileTreeJson[selectedSerie], function (index, value) {
            actualChap = index;
            if(actualChapFound)
            {
                //Chap actuel trouvé au passage précédent donc on garde ce chap en tant que nextChap
                nextChap = actualChap;
                return false;
            }
            if(actualChap == selectedChap)
            {
                actualChapFound = true;
            }
        });

        if(nextChap) {
            $("#next_chapter").show();
        } else {
            $("#next_chapter").hide();
        }
    }


    function detectPrevChapter()
    {
        prevChap = null;
        var prevChapTemp = null;
        $.each(fileTreeJson[selectedSerie], function (index, value) {
            var actualChap = index;
            var actualChapFound = false;
            if(actualChap == selectedChap)
            {
                actualChapFound = true;
            }
            if(actualChapFound && prevChapTemp)
            {
                //Chap actuel trouvé, on passe le selectedChap avec la valeur du passage d'avant
                prevChap = prevChapTemp;
                return false;
            }
            prevChapTemp = actualChap;
        });

        if(prevChap) {
            $("#prev_chapter").show();
        } else {
            $("#prev_chapter").hide();
        }
    }

    function goToNextChapter()
    {
        selectedChap = nextChap;
        changeReaderSource();
    }
    function goToPrevChapter()
    {
        selectedChap = prevChap;
        changeReaderSource();
    }
    function getFileTreeJson()
    {
        $.ajax({
            url: 'fileTree.php',
            success: function (data) {
                fileTreeJson = data;
                generateSeriesSelect();
                generateFirstPage();
            }
        });
    }

    function generateFirstPage()
    {
        if(!fileTreeJson)
        {
            return false;
        }

        $.each(fileTreeJson, function (index, value) {

            $column = $('<div>');
            $column.addClass('five wide column');

            $card = $('<div>');
            $card.addClass('ui card serie-card');
            $card.data('serie', index);

            $titre = $("<div>");
            $titre.addClass('content');
            $titre.html(index);

            $image = $("<div>");
            $image.addClass('image');

            $card.append($titre);

            $chapList = $("<div>");
            $chapList.addClass('content');
            $.each(value, function (index2, value2) {

                var image = false;
                var epub = false;

                if(typeof value2 == 'string')
                {
                    //image, on a le nom de l'image
                    image = true;
                    $imageContent = $("<div>");
                    $imageContent.addClass('content');
                    $imageDiv = $("<div>");
                    $imageDiv.addClass('image');
                    $image = $("<img>");
                    $image.attr('src', baseUrl + index + '/' + value2);
                    $imageDiv.append($image);
                    $imageContent.append($imageDiv);
                    $card.append($imageContent);

                } else {
                    //dossier epub
                    epub = true;

                    $linkDiv = $("<div>");
                    $link = $("<a>");
                    $link.addClass('chap-link pointing');
                    $link.data('chap', index2);
                    console.log($link)
                    $link.html('Chapitre ' + index2);

                    $linkDiv.append($link);
                    $chapList.append($linkDiv);

                }


            });
            $card.append($chapList);
            $column.append($card);
            $("#first_page").append($column);
        });

    }

    function goToChapterOnFirstPage(that) {

        selectedSerie = $(that).closest('.serie-card').data('serie')
        selectedChap = $(that).data('chap');

        readerEnabled = true;
        $(".ui.main.container").toggle();
        $(".masthead").toggle();
        $("#toggle_sidebar").toggle();

        changeReaderSource();

    }

    /**
     * End Function
     */

    getFileTreeJson();

    /**
     * Events
     */
    $("#series_select").on('change', function (event) {
        generateChapterSelect();
        selectedSerie = $(this).val();
        selectedChap = $("#chapter_select").val();
    });
    $("#chapter_select").on('change', function (event) {
        selectedChap = $(this).val();
    });

    $('form .button').on('click', function (event) {
        event.preventDefault();

        selectedSerie = $("#series_select").val();
        selectedChap = $("#chapter_select").val();

        var url;
        url = 'bib/i/?book='+selectedSerie+'/'+selectedChap;
        changeReaderSource(url);

        $("#toggle_sidebar").trigger('click');
        $(".masthead").toggle();
    });

    $("#next_chapter").on("click", function (event) {
        goToNextChapter();
    });
    $("#prev_chapter").on("click", function (event) {
        goToPrevChapter();
    });
    $("#first_page").on("click", ".chap-link", function(event){
        event.preventDefault();
        goToChapterOnFirstPage(this);
        
    });

});