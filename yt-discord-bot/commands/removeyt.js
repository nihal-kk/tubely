const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeyt")
    .setDescription("Remove YouTube Channel ID") // ✅ REQUIRED
    .addStringOption(option =>
      option.setName("id")
        .setDescription("Channel ID to remove") // ✅ ALSO REQUIRED
        .setRequired(true)
    ),

  async execute(interaction, { getYTChannels, saveYTChannels }) {
    const id = interaction.options.getString("id");
    let channels = getYTChannels();

    channels = channels.filter(c => c !== id);
    saveYTChannels(channels);

    await interaction.reply(`🗑 Removed: ${id}`);
  }
};