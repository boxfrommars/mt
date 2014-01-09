<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Tux</title>

    <link href="/build/vendor.css" rel="stylesheet">
    <style>
        body {
            padding-top: 50px;
        }
        .button-cell {
            width: 1%;
        }
    </style>

    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>

<body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Tux</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="container">
        <div>
            <div class="row">
                <div class="col-md-8">
                    <h3>main section</h3>
                    <div id="main-region">
                        <p>Here is static content in the web page. You'll notice that it gets replaced by our app as soon as we start it.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <h3>side section</h3>
                </div>
            </div>
        </div>
    </div>

    <div id="dialog-region"></div>

    <script type="text/template" id="contact-list-item">
        <td><%= firstName %></td>
        <td><%= lastName %></td>
        <td class="button-cell">
            <button class="btn btn-xs btn-default js-delete">
                <i class="glyphicon glyphicon-remove"></i> Delete
            </button>

        </td>
        <td class="button-cell">
            <a href="#contacts/<%= id %>" class="btn btn-xs btn-default js-show">
                <i class="glyphicon glyphicon-eye-open"></i> Show
            </a>
        </td>
        <td class="button-cell">
            <a href="#contacts/<%= id %>" class="btn btn-xs btn-default js-edit">
                <i class="glyphicon glyphicon-pencil"></i> Edit
            </a>
        </td>
    </script>

    <script type="text/template" id="contact-list">
        <thead>
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </script>

    <script type="text/template" id="contact-view">
        <h1><%= firstName %> <%= lastName %></h1>
        <a href="#contacts/<%= id %>/edit" class="btn btn-small js-edit">
            <i class="glyphicon glyphicon-pencil"></i>
            Edit this contact
        </a>
        <p><strong>Phone number:</strong> <%= phoneNumber %></p>
    </script>

    <script type="text/template" id="missing-contact-view">
        <div class="alert alert-danger">This contact doesn't exist!</div>
    </script>

    <script type="text/template" id="loading-view">
        <div id="spinner"></div>
    </script>

    <script type="text/template" id="contact-form">
        <h1>Edit <%= firstName %> <%= lastName %></h1>
        <form role="form">
            <div class="form-group">
                <label for="contact-firstName" class="control-label">First name:</label>
                <input id="contact-firstName" class="form-control" name="firstName" type="text" value="<%= firstName %>"/>
            </div>
            <div class="form-group">
                <label for="contact-lastName" class="control-label">Last name:</label>
                <input id="contact-lastName" class="form-control" name="lastName" type="text" value="<%= lastName %>"/>
            </div>
            <div class="form-group">
                <label for="contact-phoneNumber" class="control-label">Phone number:</label>
                <input id="contact-phoneNumber" class="form-control" name="phoneNumber" type="text" value="<%= phoneNumber %>"/>
            </div>
            <button class="btn btn-default js-submit">Save</button>
        </form>
    </script>

<!--    DEV part-->
    <script src="/build/vendor.min.js"></script>
    <script src="/js/app.js"></script>
    <script src="/js/config/localstorage.js"></script>
    <script src="/js/common/views.js"></script>
    <script src="/js/entities/contact.js"></script>
    <script src="/js/contacts/contacts_app.js"></script>
    <script src="/js/contacts/list/list_view.js"></script>
    <script src="/js/contacts/list/list_controller.js"></script>
    <script src="/js/contacts/show/show_view.js"></script>
    <script src="/js/contacts/show/show_controller.js"></script>
    <script src="/js/contacts/edit/edit_view.js"></script>
    <script src="/js/contacts/edit/edit_controller.js"></script>
<!--    END DEV part-->

<!--    PRODUCTION part-->
<!--    <script src="/build/scripts.min.js"></script>-->
<!--    END PRODUCTION part-->

    <script type="text/javascript">
        App.start();
    </script>
</body>
</html>
