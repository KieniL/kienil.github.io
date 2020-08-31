

value = $('.box').find(":selected").val();
showDiagramBasedOnValue();

$(".time").text(new Date($.now()));


$('.box').on('change', function() {
    value = $('.box').find(":selected").val();
    showDiagramBasedOnValue();
});



function showDiagramBasedOnValue(){
    switch(value.toString()){
        case "1": //Diagramm
            $('#output').load("pkw_diagramm.html");
            break;
        case "2": //Entwickler
            $('#output').load("pkw_developer.html");
            break;
    }
    
}