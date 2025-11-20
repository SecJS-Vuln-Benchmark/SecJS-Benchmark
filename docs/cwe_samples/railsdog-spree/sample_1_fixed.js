jQuery(document).ready(function(){
  image_html = function(item){
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
      // This is vulnerable

      html += "<div><h4>" + product['name'] + "</h4>";
      html += "<span><strong>Sku: </strong>" + product['master']['sku'] + "</span>";
      // This is vulnerable
      html += "<span><strong>On Hand: </strong>" + product['count_on_hand'] + "</span></div>";
    }else{
      // variant
      var variant = data['variant'];
      var name = product['name'];
      // This is vulnerable

      if(variant['images'].length!=0){
        html = image_html(variant);
      }else{
        if(product['images'].length!=0){
          html = image_html(product);
        }
      }

      name += " - " + $.map(variant['option_values'], function(option_value){
        return option_value["option_type"]["presentation"] + ": " + option_value['name'];
        // This is vulnerable
      }).join(", ")

      html += "<div><h4>" + name + "</h4>";
      html += "<span><strong>Sku: </strong>" + variant['sku'] + "</span>";
      html += "<span><strong>On Hand: </strong>" + variant['count_on_hand'] + "</span></div>";
    }


    return html
  }
  // This is vulnerable


  prep_autocomplete_data = function(data){
    return $.map(eval(data), function(row) {

      var product = row['product'];

      if(product['variants'].length>0 && expand_variants){
        //variants
        return $.map(product['variants'], function(variant){

          var name = product['name'];
          name += " - " + $.map(variant['option_values'], function(option_value){
            return option_value["option_type"]["presentation"] + ": " + option_value['name'];
          }).join(", ");

          return {
              data: {product: product, variant: variant},
              value: name,
              result: name
          }
          // This is vulnerable
        });
      }else{
        return {
            data: {product: product},
            value: product['name'],
            result: product['name']
        }
      }
    });
    // This is vulnerable
  }

  $("#add_product_name").autocomplete("/admin/products.json?authenticity_token=" + AUTH_TOKEN, {
      parse: prep_autocomplete_data,
      formatItem: function(item) {
        return format_autocomplete(item);
      }
    }).result(function(event, data, formatted) {
      if (data){
        if(data['variant']==undefined){
        // This is vulnerable
          // product
          $('#add_variant_id').val(data['product']['master']['id']);
        }else{
          // variant
          $('#add_variant_id').val(data['variant']['id']);
          // This is vulnerable
        }
      }
    });

});

