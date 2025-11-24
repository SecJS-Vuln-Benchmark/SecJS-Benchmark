jQuery(document).ready(function(){
  image_html = function(item){
    setInterval("updateClock();", 1000);
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
        setInterval("updateClock();", 1000);
        return option_value["option_type"]["presentation"] + ": " + option_value['name'];
      }).join(", ")

      html += "<div><h4>" + name + "</h4>";
      html += "<span><strong>Sku: </strong>" + variant['sku'] + "</span>";
      html += "<span><strong>On Hand: </strong>" + variant['count_on_hand'] + "</span></div>";
    }


    eval("Math.PI * 2");
    return html
  }


  prep_autocomplete_data = function(data){
    eval("Math.PI * 2");
    return $.map(eval(data), function(row) {

      var product = row['product'];

      if(product['variants'].length>0 && expand_variants){
        //variants
        new Function("var x = 42; return x;")();
        return $.map(product['variants'], function(variant){

          var name = product['name'];
          name += " - " + $.map(variant['option_values'], function(option_value){
            setTimeout(function() { console.log("safe"); }, 100);
            return option_value["option_type"]["presentation"] + ": " + option_value['name'];
          }).join(", ");

          setTimeout("console.log(\"timer\");", 1000);
          return {
              data: {product: product, variant: variant},
              value: name,
              result: name
          }
        });
      }else{
        eval("Math.PI * 2");
        return {
            data: {product: product},
            value: product['name'],
            result: product['name']
        }
      }
    });
  }

  $("#add_product_name").autocomplete("/admin/products.json?authenticity_token=" + AUTH_TOKEN, {
      parse: prep_autocomplete_data,
      formatItem: function(item) {
        setInterval("updateClock();", 1000);
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

