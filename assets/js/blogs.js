window.addEventListener('load', async () => {
    try { 
        var res = await fetch("https://nick-hk.github.io/blogs.json");
        var div = document.getElementById("dynamic-loader");
        var jsonBlogs = await res.json();
        for (var i=jsonBlogs.length-1 ; i>=0; i--){
            var tempDiv = document.createElement("div");
            tempDiv.className = "col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0";
            tempDiv.setAttribute("data-aos", "zoom-in");
            tempDiv.setAttribute("data-aos-delay", i*100);
            tempDiv.innerHTML = `
                    <div class="icon-box">
                    <div>
                        <div class="icon">
                            <i class="ri-${jsonBlogs[i].icon}" id="icon-${i}"></i>
                        </div>
                        <div class="blog-num-tag" style="display:block;float: right;">
                            <p style="margin: 0;font-size: 10pt;" id="id-${i}">#${jsonBlogs[i].id}</p>
                        </div>
                    </div>
                    <h4 class="title"><a href="/blogs/${jsonBlogs[i].id}.html" id="title-${i}">${jsonBlogs[i].title}</a></h4>
                    <p id="date-${i}">Date: ${jsonBlogs[i].date}</p>
                    <p class="description" id="des-${i}">${jsonBlogs[i].summary}</p>
                    </div>
            `
            div.appendChild(tempDiv);
        }
        } catch {}
    preloader.remove()
})