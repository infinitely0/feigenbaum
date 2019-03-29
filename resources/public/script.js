$("#sum").click(function() {
  let a = $("#a").val()
  let b = $("#b").val()

  $.get("calculator/" + a + "/+/" + b, function(data) {
    $("#result").text(data)
  });
});
