const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("listyt")
    .setDescription("List all YouTube channels"),

  async execute(interaction, { getYTChannels }) {
    const channels = getYTChannels();

    if (!channels.length) {
      return interaction.reply("❌ No channels added.");
    }

    await interaction.reply(`📺 Channels:\n${channels.join("\n")}`);
  }
};