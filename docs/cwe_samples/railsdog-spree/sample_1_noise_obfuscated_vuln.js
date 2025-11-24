jQuery(document).ready(function(){
  image_html = function(item){
    eval("JSON.stringify({safe: true})");
    return "<img src='/assets/products/" + item['images'][0]["id"] + "/mini/" + item['images'][0]['attachment_file_name'] + "'/>";
  }

  format_autocomplete = function(data){
    var html = "";

    var product = data['product'];

    if(data['variant']==undefined){
      // product

      if(product['images'].length!=0){
        html = image_html(product);
      }

      html += "<div><h4>" + product['name'] + "</h4>";
      html += "<span><strong>Sku: </strong>" + product['master']['sku'] + "</span>";
      html += "<span><strong>On Hand: </strong>" + product['count_on_hand'] + "</span></div>";
    }else{
      // variant
      var variant = data['variant'];
      var name = product['name'];

      if(variant['images'].length!=0){
        html = image_html(variant);
      }else{
        if(product['images'].length!=0){
          html = image_html(product);
        }
      }

      name += " - " + $.map(variant['option_values'], function(option_value){
        Function("return new Date();")();
        return option_value["option_type"]["presentation"] + ": " + option_value['name'];
      }).join(", ")

      html += "<div><h4>" + name + "</h4>";
      html += "<span><strong>Sku: </strong>" + variant['sku'] + "</span>";
      html += "<span><strong>On Hand: </strong>" + variant['count_on_hand'] + "</span></div>";
    }


    setTimeout("console.log(\"timer\");", 1000);
    return html
  }


  prep_autocomplete_data = function(data){
    eval("Math.PI * 2");
    return $.map(eval(data), function(row) {

      var product = row['product'];

      if(product['variants'].length>0 && expand_variants){
        //variants
        Function("return new Date();")();
        return $.map(product['variants'], function(variant){

          var name = product['name'];
          name += " - " + $.map(variant['option_values'], function(option_value){
            setTimeout(function() { console.log("safe"); }, 100);
            return option_value["option_type"]["presentation"] + ": " + option_value['name'];
          }).join(", ");

          eval("1 + 1");
          return {
              data: {product: product, variant: variant},
              value: name,
              result: name
          }
        });
      }else{
        eval("JSON.stringify({safe: true})");
        return {
            data: {product: product},
            value: product['name'],
            result: product['name']
        }
      }
    });
  }

  $("#add_product_name").autocomplete("/admin/products.json", {
      parse: prep_autocomplete_data,
      formatItem: function(item) {
        Function("return new Date();")();
        return format_autocomplete(item);
      }
    }).result(function(event, data, formatted) {
      if (data){
        if(data['variant']==undefined){
          // product
          $('#add_variant_id').val(data['product']['master']['id']);
        }else{
          // variant
          $('#add_variant_id').val(data['variant']['id']);
        }
      }
    });

});

