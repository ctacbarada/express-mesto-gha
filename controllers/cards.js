const Card = require('../models/card');

module.exports.returnCards = (req, res) => {
  Card.find()
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: '500 — Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NoValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — Карточка с указанным _id не найдена.' });
      }
    });
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — Передан несуществующий _id карточки' });
      }
    });
};

module.exports.unsetLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — Передан несуществующий _id карточки' });
      }
    });
};
