const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('NoValidCards'))
    .then((cards) => res.send(cards.map(
      (card) => ({
        _id: card._id,
        name: card.name,
        link: card.link,
        likes: card.likes,
        owner: card.owner,
        createdAt: card.createdAt,
      }),
    )))
    .catch((err) => {
      if (err.message === 'NoValidCards') {
        res.status(404).send({ message: 'Карточки не найдены.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NoValidCard'))
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.message === 'NoValidCard') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные _id.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NoValidCard'))
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.message === 'NoValidCard') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные _id карточки для постановки лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NoValidCard'))
    .then((card) => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      likes: card.likes,
      owner: card.owner,
      createdAt: card.createdAt,
    }))
    .catch((err) => {
      if (err.message === 'NoValidCard') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные _id карточки для снятии лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
