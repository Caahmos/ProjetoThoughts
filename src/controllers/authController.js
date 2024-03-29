const { User } = require('../models/User');

exports.register = (req, res) => {
    res.render('auth/register');
}

exports.login = (req, res) => {
    res.render('auth/login');
}

exports.registrarDB = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.registrar();

        if (user.errors.length > 0) {
            req.flash('errors', user.errors)
            req.session.save(() => { res.redirect('back') });
            return;
        };

        console.log('ID DO USUÁRIO: ----------- ' + user.user.id)

        req.session.userId = user.user.id;
        req.flash('success', 'Usuário cadastrado com sucesso!')

        req.session.save(() => {
            res.redirect('/');
        })

    } catch (error) {
        console.log(error);
    }
};

exports.logarDB = async (req, res, next) => {
    try {
        const user = new User(req.body);
        const usuario = await user.logar();

        if (usuario) {
            req.session.userId = usuario.id;
            req.flash('success', `Seja bem vindo, ${usuario.name}`);
            req.session.save(() => {
                res.redirect('/');
            });
            return;
        }
        req.flash('errors', user.errors);
        req.session.save(() => {
            res.redirect('back')
        })

    } catch (error) {
        console.log(error);
    }
}

exports.sair = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};