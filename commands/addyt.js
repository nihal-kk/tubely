const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addyt")
    .setDescription("Add YouTube Channel ID")
    .addStringOption(option =>
      option.setName("id")
        .setDescription("YouTube Channel ID (UCxxxx)")
        .setRequired(true)
    ),

  async execute(interaction, { getYTChannels, saveYTChannels }) {
    const id = interaction.options.getString("id");

    if (!id.startsWith("UC")) {
      return interaction.reply("❌ Invalid Channel ID!");
    }

    const channels = getYTChannels();

    if (channels.includes(id)) {
      return interaction.reply("⚠️ Already added!");
    }

    channels.push(id);
    saveYTChannels(channels);

    await interaction.reply(`✅ Added channel: ${id}`);
  }
};