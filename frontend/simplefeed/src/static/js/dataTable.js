$(document).ready(function() {
    $('#dataTable').DataTable( {
        language: {
            "decimal":        "",
            "emptyTable":     "No data available in table",
            "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
            "infoEmpty":      "Zobrazeno 0 to 0 of 0 entries",
            "infoFiltered":   "(filtered from _MAX_ total entries)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Zobrazit _MENU_ parametrů",
            "loadingRecords": "Načítání",
            "processing":     "",
            "search":         "Vyhledat parametr",
            "zeroRecords":    "Žádný výsledek",
            "paginate": {
                "first":      "První",
                "last":       "Poslední",
                "next":       "Další",
                "previous":   "Předchozí"
            },
            "aria": {
                "sortAscending":  ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            }
        }
    } );
  } );