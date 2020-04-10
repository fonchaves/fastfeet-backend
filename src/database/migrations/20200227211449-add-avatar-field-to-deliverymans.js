module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('deliverymans', 'avatar_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  // FIXME: Descobrir o porquê de não estar setando o allowNull como false
  down: queryInterface => {
    return queryInterface.removeConstraint(
      'deliverymans',
      'deliverymans_avatar_id_fkey',
      {
        allowNull: false,
      }
    );
  },
};
