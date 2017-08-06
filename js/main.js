$(function()
{

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

    function generateChapterSelect()
    {
        if(!$("#series_select").val())
        {

            return false;
        }

        var serie = $("#series_select").val();

        var chapterSerie = fileTreeJson[serie];

        console.log(serie);

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

    function getFileTreeJson()
    {
        $.ajax({
            url: 'fileTree.php',
            success: function (data) {
                fileTreeJson = data;
                console.log('appel generateSeriesSelect')
                generateSeriesSelect();
            }
        });

    }
    getFileTreeJson();

    $("#series_select").on('change', function (event) {
        generateChapterSelect();
        selectedSerie = $(this).val();
    });
    $("#chapter_select").on('change', function (event) {
        selectedChap = $(this).val();
    });

    $('.submit').on('click', function (event) {
        event.preventDefault();

        selectedSerie = $("#series_select").val();
        selectedChap = $("#chapter_select").val();

        var url;
        url = 'bib/i/?book='+selectedSerie+'/'+selectedChap;
        var epubUrl = encodeURI(url);
        $("#embedded_reader").attr('src', epubUrl);

        $("#toggle_sidebar").trigger('click');

    });

});